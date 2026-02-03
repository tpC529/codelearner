// text-worker.js - Web Worker for text-based code explanation using lightweight LLM
// This runs in a separate thread for fast text processing

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Configure Transformers.js environment
env.allowLocalModels = false;
env.allowRemoteModels = true;

// Global model instance
let textModelPipeline = null;
let modelLoading = false;
let modelLoaded = false;

// Model configuration for text-based code explanation
const TEXT_MODEL_CONFIG = {
  primary: {
    name: 'Xenova/codet5-small',
    task: 'text2text-generation',
    options: {
      device: 'auto', // Prioritize WebGPU
    }
  },
  fallback: {
    name: 'Xenova/t5-small',
    task: 'text2text-generation',
    options: {
      device: 'auto',
    }
  }
};

/**
 * Initialize the text model pipeline
 * @param {string} modelChoice - 'primary' or 'fallback'
 * @returns {Promise<void>}
 */
async function initializeTextModel(modelChoice = 'primary') {
  if (modelLoaded) {
    return;
  }

  if (modelLoading) {
    while (modelLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  modelLoading = true;

  try {
    const config = TEXT_MODEL_CONFIG[modelChoice];
    console.log(`[Text Worker] Loading ${config.name}...`);

    self.postMessage({
      type: 'progress',
      status: 'downloading',
      message: `Loading text model...`,
      progress: 0
    });

    textModelPipeline = await pipeline(
      config.task,
      config.name,
      config.options
    );

    modelLoaded = true;
    console.log(`[Text Worker] Model ${config.name} loaded successfully`);

    self.postMessage({
      type: 'progress',
      status: 'ready',
      message: 'Text model ready',
      progress: 100
    });

  } catch (error) {
    console.error('[Text Worker] Error loading model:', error);

    if (modelChoice === 'primary') {
      console.log('[Text Worker] Trying fallback model...');
      self.postMessage({
        type: 'progress',
        status: 'downloading',
        message: 'Primary text model failed, trying alternative...',
        progress: 0
      });

      modelLoading = false;
      return await initializeTextModel('fallback');
    }

    self.postMessage({
      type: 'error',
      error: `Failed to load text model: ${error.message}`
    });

    throw error;
  } finally {
    modelLoading = false;
  }
}

/**
 * Extract and explain code from text
 * @param {string} codeText - The extracted code text
 * @param {string} language - Detected programming language
 * @returns {Promise<string>}
 */
async function explainCodeText(codeText, language = '') {
  try {
    if (!modelLoaded) {
      await initializeTextModel();
    }

    console.log('[Text Worker] Explaining code...');

    self.postMessage({
      type: 'progress',
      status: 'processing',
      message: 'Analyzing code...',
      progress: 50
    });

    // Create a focused prompt for code explanation
    const prompt = `Explain this ${language ? language + ' ' : ''}code in simple terms: ${codeText}`;

    const result = await textModelPipeline(prompt, {
      max_new_tokens: 150,
      temperature: 0.1,
      do_sample: false,
    });

    console.log('[Text Worker] Explanation generated');

    let explanation = '';
    if (Array.isArray(result)) {
      explanation = result[0]?.generated_text || result[0]?.text || '';
    } else if (result.generated_text) {
      explanation = result.generated_text;
    } else if (result.text) {
      explanation = result.text;
    } else {
      explanation = String(result);
    }

    explanation = explanation.trim();

    if (!explanation) {
      explanation = 'Unable to generate explanation for this code snippet.';
    }

    return explanation;

  } catch (error) {
    console.error('[Text Worker] Error explaining code:', error);
    throw error;
  }
}

/**
 * Detect programming language from code text
 * @param {string} codeText - The code text
 * @returns {string} Detected language
 */
function detectLanguage(codeText) {
  const languagePatterns = {
    javascript: /\b(function|const|let|var|if|else|for|while|class|import|export)\b/,
    python: /\b(def|class|import|from|if|elif|else|for|while|try|except|with)\b/,
    java: /\b(public|private|class|void|int|String|if|else|for|while|import)\b/,
    cpp: /\b(#include|int|void|class|if|else|for|while|std::)\b/,
    csharp: /\b(using|namespace|class|void|int|string|if|else|for|while|public)\b/,
    php: /\b(<\?php|function|if|else|foreach|echo|class)\b/,
    ruby: /\b(def|class|if|else|end|puts|require)\b/,
    go: /\b(package|func|import|if|else|for|fmt\.)\b/,
    rust: /\b(fn|let|mut|if|else|for|while|use|mod|pub)\b/,
    html: /<\/?[a-zA-Z][^>]*>/,
    css: /\{[^}]*\}/,
    sql: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE)\b/i,
  };

  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(codeText)) {
      return lang;
    }
  }

  return 'unknown';
}

// Message handler
self.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  try {
    switch (type) {
      case 'initialize':
        await initializeTextModel(data?.modelChoice);
        self.postMessage({ type: 'initialized', status: { loaded: modelLoaded, loading: modelLoading } });
        break;

      case 'explain':
        const language = detectLanguage(data.codeText);
        const explanation = await explainCodeText(data.codeText, language);
        self.postMessage({
          type: 'result',
          explanation: explanation,
          language: language,
          codeText: data.codeText
        });
        break;

      case 'status':
        self.postMessage({ type: 'status', status: { loaded: modelLoaded, loading: modelLoading } });
        break;

      default:
        self.postMessage({ type: 'error', error: `Unknown message type: ${type}` });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message || 'Unknown error occurred'
    });
  }
});

// Initialize on worker start
console.log('[Text Worker] Worker started, ready to initialize text model');
self.postMessage({ type: 'ready' });