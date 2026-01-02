// model-worker.js - Web Worker for Transformers.js model inference
// This runs in a separate thread to avoid blocking the UI

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Configure Transformers.js environment
env.allowLocalModels = false; // Use CDN models
env.allowRemoteModels = true;

// Global model instance
let modelPipeline = null;
let modelLoading = false;
let modelLoaded = false;

// Model configuration
const MODEL_CONFIG = {
  // Primary model - smaller and faster
  primary: {
    name: 'Xenova/florence-2-base-ft',
    task: 'image-to-text',
    options: {
      device: 'auto', // WebGPU > WebGL > WASM
      dtype: 'q8', // Quantized int8 for smaller size
    }
  },
  // Fallback model if primary fails
  fallback: {
    name: 'Xenova/moondream2',
    task: 'image-to-text',
    options: {
      device: 'auto',
      dtype: 'q8',
    }
  }
};

/**
 * Initialize the model pipeline
 * @param {string} modelChoice - 'primary' or 'fallback'
 * @returns {Promise<void>}
 */
async function initializeModel(modelChoice = 'primary') {
  if (modelLoaded) {
    return;
  }
  
  if (modelLoading) {
    // Wait for existing load to complete
    while (modelLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }
  
  modelLoading = true;
  
  try {
    const config = MODEL_CONFIG[modelChoice];
    console.log(`[Model Worker] Loading ${config.name}...`);
    
    // Report progress
    self.postMessage({
      type: 'progress',
      status: 'downloading',
      message: `Downloading ${config.name} model... (first time only, ~80-500MB)`,
      progress: 0
    });
    
    // Initialize pipeline with progress tracking
    modelPipeline = await pipeline(
      config.task,
      config.name,
      config.options
    );
    
    modelLoaded = true;
    console.log(`[Model Worker] Model ${config.name} loaded successfully`);
    
    self.postMessage({
      type: 'progress',
      status: 'ready',
      message: 'Model loaded and ready',
      progress: 100
    });
    
  } catch (error) {
    console.error('[Model Worker] Error loading model:', error);
    
    // Try fallback if primary failed
    if (modelChoice === 'primary') {
      console.log('[Model Worker] Trying fallback model...');
      self.postMessage({
        type: 'progress',
        status: 'downloading',
        message: 'Primary model failed, trying alternative...',
        progress: 0
      });
      
      modelLoading = false;
      return await initializeModel('fallback');
    }
    
    self.postMessage({
      type: 'error',
      error: `Failed to load model: ${error.message}`
    });
    
    throw error;
  } finally {
    modelLoading = false;
  }
}

/**
 * Process an image and generate explanation
 * @param {string} imageData - Base64 encoded image data URL
 * @param {number[]} coords - [x1, y1, x2, y2] coordinates (optional, for cropping)
 * @returns {Promise<string>}
 */
async function processImage(imageData, coords = null) {
  try {
    // Ensure model is loaded
    if (!modelLoaded) {
      await initializeModel();
    }
    
    console.log('[Model Worker] Processing image...');
    
    self.postMessage({
      type: 'progress',
      status: 'processing',
      message: 'Analyzing code...',
      progress: 50
    });
    
    // Crop image if coordinates provided
    let processedImage = imageData;
    if (coords && coords.length === 4) {
      processedImage = await cropImage(imageData, coords);
    }
    
    // Generate explanation
    const prompt = 'Describe what code or text you see in this image. What programming language is it? What does it do?';
    
    const result = await modelPipeline(processedImage, {
      prompt: prompt,
      max_new_tokens: 100,
      temperature: 0.3,
    });
    
    console.log('[Model Worker] Processing complete');
    
    // Extract text from result
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
      explanation = 'No explanation generated. The model may not have recognized any code in the selection.';
    }
    
    return explanation;
    
  } catch (error) {
    console.error('[Model Worker] Error processing image:', error);
    throw error;
  }
}

/**
 * Crop image to specified coordinates using Canvas API
 * @param {string} imageData - Base64 encoded image data URL
 * @param {number[]} coords - [x1, y1, x2, y2]
 * @returns {Promise<string>} Cropped image as data URL
 */
async function cropImage(imageData, coords) {
  // Note: Canvas API not available in Web Workers
  // This will be handled in the main thread before sending to worker
  // For now, return the original image
  return imageData;
}

/**
 * Get model status
 * @returns {Object}
 */
function getModelStatus() {
  return {
    loaded: modelLoaded,
    loading: modelLoading,
  };
}

// Message handler
self.addEventListener('message', async (event) => {
  const { type, data } = event.data;
  
  try {
    switch (type) {
      case 'initialize':
        await initializeModel(data?.modelChoice);
        self.postMessage({ type: 'initialized', status: getModelStatus() });
        break;
        
      case 'process':
        const explanation = await processImage(data.imageData, data.coords);
        self.postMessage({
          type: 'result',
          explanation: explanation,
          croppedImage: data.imageData // Return cropped image for display
        });
        break;
        
      case 'status':
        self.postMessage({ type: 'status', status: getModelStatus() });
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
console.log('[Model Worker] Worker started, ready to initialize model');
self.postMessage({ type: 'ready' });
