// Use browser API for cross-browser compatibility (Chrome, Firefox, Safari)
const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

let selecting = false;
let startX, startY;
let questionCount = 0;
let selectionMode = 'shift-drag'; // Default
const overlay = document.createElement("div");
overlay.style.cssText = "position:absolute; border:3px solid #007BFF; background:rgba(0,123,255,0.15); pointer-events:none; z-index:9999999; display:none;";
document.body.appendChild(overlay);

// Model worker state
let modelWorker = null;
let modelReady = false;
let modelInitializing = false;

// Text worker state for code extraction
let textWorker = null;
let textReady = false;
let textInitializing = false;
let textModeDisabled = false; // Flag to track if text mode is disabled

/**
 * Detect browser type
 * @returns {string} 'chrome', 'edge', or 'other'
 */
function detectBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Edg") > -1) {
    return 'edge';
  } else if (userAgent.indexOf("Chrome") > -1) {
    return 'chrome';
  }
  return 'other';
}

/**
 * Show user notification message
 * @param {string} message - The message to show
 * @param {boolean} isError - Whether this is an error message
 */
function showUserMessage(message, isError = false) {
  // Use a simple alert for now, could be enhanced with a custom UI later
  if (isError) {
    console.error('[CodeLearner]', message);
    alert('CodeLearner: ' + message);
  } else {
    console.log('[CodeLearner]', message);
  }
}

/**
 * Initialize model worker
 */
function initializeModelWorker() {
  if (modelWorker || modelInitializing) {
    return;
  }
  
  modelInitializing = true;
  console.log('[CodeLearner] Initializing model worker...');
  
  try {
    modelWorker = new Worker(browserAPI.runtime.getURL('model-worker.js'), { type: 'module' });
    
    modelWorker.addEventListener('message', (event) => {
      const { type, status, message, error } = event.data;
      
      switch (type) {
        case 'ready':
          console.log('[CodeLearner] Model worker ready');
          break;
          
        case 'initialized':
          modelReady = true;
          modelInitializing = false;
          console.log('[CodeLearner] Model initialized:', status);
          break;
          
        case 'progress':
          console.log('[CodeLearner] Model progress:', message);
          updateLoadingPanel(message, status);
          if (status === 'ready') {
            modelReady = true;
            modelInitializing = false;
          }
          break;
          
        case 'error':
          console.error('[CodeLearner] Model worker error:', error);
          modelInitializing = false;
          break;
      }
    });
    
    modelWorker.addEventListener('error', (error) => {
      console.error('[CodeLearner] Worker error:', error);
      modelInitializing = false;
    });
    
  } catch (error) {
    console.error('[CodeLearner] Failed to create worker:', error);
    modelInitializing = false;
  }
}

/**
 * Initialize text worker
 */
function initializeTextWorker() {
  if (textWorker || textInitializing || textModeDisabled) {
    return;
  }
  
  textInitializing = true;
  console.log('[CodeLearner] Initializing text worker...');
  
  try {
    textWorker = new Worker(browserAPI.runtime.getURL('text-worker.js'), { type: 'module' });
    
    textWorker.addEventListener('message', (event) => {
      const { type, status, message, error } = event.data;
      
      switch (type) {
        case 'ready':
          console.log('[CodeLearner] Text worker ready');
          break;
          
        case 'initialized':
          textReady = true;
          textInitializing = false;
          console.log('[CodeLearner] Text model initialized:', status);
          break;
          
        case 'progress':
          console.log('[CodeLearner] Text progress:', message);
          if (status === 'ready') {
            textReady = true;
            textInitializing = false;
          }
          break;
          
        case 'error':
          console.error('[CodeLearner] Text worker error:', error);
          textInitializing = false;
          break;
      }
    });
    
    textWorker.addEventListener('error', (error) => {
      console.error('[CodeLearner] Text worker error:', error);
      textInitializing = false;
    });
    
  } catch (error) {
    console.error('[CodeLearner] Failed to create text worker:', error);
    textInitializing = false;
    
    // Handle SecurityError specifically for Edge on HTTPS pages
    if (error.name === 'SecurityError' || error.message.includes('SecurityError')) {
      const browser = detectBrowser();
      textModeDisabled = true;
      
      if (browser === 'edge') {
        showUserMessage('Text mode is not supported in Microsoft Edge on HTTPS pages due to browser security restrictions. CodeLearner will use image-only mode for code explanations.', false);
      } else {
        showUserMessage('Text mode initialization failed due to security restrictions. CodeLearner will use image-only mode for code explanations.', false);
      }
    } else {
      // For other errors, show as error but still disable text mode
      textModeDisabled = true;
      showUserMessage('Text mode initialization failed: ' + error.message + '. CodeLearner will use image-only mode.', true);
    }
  }
}

// Initialize workers on content script load
initializeModelWorker();
initializeTextWorker();

// Load selection mode from storage
browserAPI.storage.sync.get(['selectionMode'], (result) => {
  selectionMode = result.selectionMode || 'shift-drag';
});

document.addEventListener("mousedown", e => {
  const shouldSelect = (selectionMode === 'shift-drag' && e.shiftKey) || (selectionMode === 'click-drag' && !e.shiftKey);
  if (shouldSelect) {
    selecting = true;
    startX = e.pageX;
    startY = e.pageY;
    overlay.style.display = "block";
    overlay.style.left = startX + "px";
    overlay.style.top = startY + "px";
    overlay.style.width = overlay.style.height = "0px";
  }
});

document.addEventListener("mousemove", e => {
  if (!selecting) return;
  const x = e.pageX, y = e.pageY;
  overlay.style.left   = Math.min(startX, x) + "px";
  overlay.style.top    = Math.min(startY, y) + "px";
  overlay.style.width  = Math.abs(x - startX) + "px";
  overlay.style.height = Math.abs(y - startY) + "px";
});

document.addEventListener("mouseup", async () => {
  if (!selecting) return;
  selecting = false;
  
  const rect = overlay.getBoundingClientRect();
  const coords = [rect.left + window.scrollX, rect.top + window.scrollY,
                  rect.right + window.scrollX, rect.bottom + window.scrollY];

  overlay.style.display = "none";

  console.log("[CodeLearner] Coords:", coords);
  console.log("[CodeLearner] Rect:", rect);
  
  // Ignore if box is too small (just a click, not a drag)
  if (rect.width < 5 || rect.height < 5) {
    console.log("[CodeLearner] Box too small, ignoring");
    return;
  }

  // Check question limit before processing
  if (questionCount >= 3) {
    alert("Limit reached (3 questions). Reload page to reset.");
    return;
  }

  // Try text extraction first if quick mode or if code elements detected, and text mode is not disabled
  const extractedText = extractTextFromSelection(coords);
  let processedSuccessfully = false;
  
  if (extractedText && !textModeDisabled && (useQuickMode || isCodeContent(extractedText))) {
    console.log("[CodeLearner] Using text-based extraction");
    try {
      await processWithText(extractedText);
      processedSuccessfully = true;
    } catch (textError) {
      console.error('[CodeLearner] Text processing failed, falling back to image mode:', textError);
      // Continue to image mode below
    }
  }

  // Use image mode if text mode was not used or failed
  if (!processedSuccessfully) {
    // Fallback to image mode
    try {
      const response = await browserAPI.runtime.sendMessage({action: "capture"});
      console.log("[CodeLearner] Response:", response);
      
      if (!response || typeof response === 'object' && response.error) {
        console.error("[CodeLearner] Screenshot capture failed:", response?.error);
        alert("Screenshot capture failed: " + (response?.error || "No response"));
        return;
      }
      
      const screenshot = response;

      console.log("[CodeLearner] Screenshot captured, processing...");
      
      // Check if we should use backend or browser-based inference
      let useBackend = false;
      try {
        const { inferenceMode } = await browserAPI.storage.sync.get(['inferenceMode']);
        useBackend = inferenceMode === 'backend';
      } catch (storageErr) {
        console.error("[CodeLearner] Storage access error:", storageErr);
      }
      
      if (useBackend) {
        // Use legacy backend mode
        await processWithBackend(screenshot, coords);
      } else {
        // Use browser-based inference (default)
        await processWithBrowser(screenshot, coords);
      }
    } catch (error) {
      console.error("[CodeLearner] Error:", error);
      alert("Error: " + error.message);
      return;
    }
  }

  questionCount++;
});

/**
 * Process screenshot using browser-based inference
 */
async function processWithBrowser(screenshot, coords) {
  try {
    console.log('[CodeLearner] Using browser-based inference...');
    
    // Initialize worker if not ready
    if (!modelReady && !modelInitializing) {
      showLoadingPanel('Initializing AI model... (first time only)');
      initializeModelWorker();
      
      // Send initialization message
      modelWorker.postMessage({ type: 'initialize' });
      
      // Wait for model to be ready
      await waitForModelReady();
    }
    
    // Crop image before sending to worker
    const croppedImage = await cropImageInMainThread(screenshot, coords);
    
    showLoadingPanel('Analyzing code...');
    
    // Send image to worker for processing
    return new Promise((resolve, reject) => {
      const messageHandler = (event) => {
        const { type, explanation, croppedImage: resultImage, error } = event.data;
        
        if (type === 'result') {
          modelWorker.removeEventListener('message', messageHandler);
          showFloatingPanel(resultImage, explanation);
          resolve();
        } else if (type === 'error') {
          modelWorker.removeEventListener('message', messageHandler);
          hideLoadingPanel();
          
          // Fallback to backend if available
          console.error('[CodeLearner] Browser inference failed:', error);
          alert('Browser inference failed: ' + error + '\n\nPlease enable backend mode in settings if you have Python backend running.');
          reject(new Error(error));
        }
      };
      
      modelWorker.addEventListener('message', messageHandler);
      modelWorker.postMessage({
        type: 'process',
        data: {
          imageData: croppedImage,
          coords: null // Already cropped
        }
      });
      
      // Timeout after 60 seconds
      setTimeout(() => {
        modelWorker.removeEventListener('message', messageHandler);
        hideLoadingPanel();
        reject(new Error('Processing timeout'));
      }, 60000);
    });
    
  } catch (error) {
    console.error('[CodeLearner] Browser processing error:', error);
    hideLoadingPanel();
    throw error;
  }
}

/**
 * Process screenshot using legacy Python backend
 */
async function processWithBackend(screenshot, coords) {
  try {
    console.log("[CodeLearner] Using backend inference...");
    
    // Get backend URL from storage
    let apiUrl = 'http://127.0.0.1:8000';
    try {
      const { backendUrl } = await browserAPI.storage.sync.get(['backendUrl']);
      apiUrl = backendUrl || 'http://127.0.0.1:8000';
    } catch (storageErr) {
      console.error("[CodeLearner] Storage access error:", storageErr);
    }

    console.log("[CodeLearner] Using backend URL:", apiUrl);
    
    showLoadingPanel('Sending to backend...');

    const res = await fetch(`${apiUrl}/api`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({image_b64: screenshot, coords, question_count: questionCount})
    }).catch(err => {
      console.error("[CodeLearner] Fetch error details:", err);
      throw err;
    });

    console.log("[CodeLearner] Response status:", res.status);
    const data = await res.json();
    console.log("[CodeLearner] Response data:", data);
    
    if (!res.ok) {
      console.error("[CodeLearner] Backend error:", JSON.stringify(data, null, 2));
      hideLoadingPanel();
      alert("Backend error: " + JSON.stringify(data.detail || data));
      return;
    }
    
    showFloatingPanel(data.highlighted, data.explanation);
    
  } catch (error) {
    console.error('[CodeLearner] Backend processing error:', error);
    hideLoadingPanel();
    throw error;
  }
}

/**
 * Wait for text model to be ready
 */
function waitForTextReady() {
  return new Promise((resolve, reject) => {
    const checkReady = () => {
      if (textReady) {
        resolve();
      } else if (textModeDisabled) {
        reject(new Error('Text mode is disabled'));
      } else if (!textInitializing && !textReady) {
        reject(new Error('Text model initialization failed'));
      } else {
        setTimeout(checkReady, 500);
      }
    };
    checkReady();
    
    // Timeout after 2 minutes
    setTimeout(() => reject(new Error('Text model initialization timeout')), 120000);
  });
}

/**
 * Extract text from selected area by finding overlapping elements
 * @param {number[]} coords - [x1, y1, x2, y2]
 * @returns {string|null} Extracted text or null
 */
function extractTextFromSelection(coords) {
  const [x1, y1, x2, y2] = coords;
  const selectionRect = { left: x1, top: y1, right: x2, bottom: y2 };
  
  // Find all text-containing elements that overlap with selection
  const elements = document.querySelectorAll('code, pre, .hljs, .syntax-highlight, [class*="highlight"], [class*="code"]');
  let extractedText = '';
  
  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    const elementRect = {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      right: rect.right + window.scrollX,
      bottom: rect.bottom + window.scrollY
    };
    
    // Check if element overlaps with selection
    if (!(elementRect.left > selectionRect.right || 
          elementRect.right < selectionRect.left || 
          elementRect.top > selectionRect.bottom || 
          elementRect.bottom < selectionRect.top)) {
      
      // Extract text content
      const text = element.textContent || element.innerText || '';
      if (text.trim()) {
        extractedText += text.trim() + '\n';
      }
    }
  }
  
  return extractedText.trim() || null;
}

/**
 * Check if extracted text appears to be code
 * @param {string} text - The extracted text
 * @returns {boolean} True if likely code
 */
function isCodeContent(text) {
  if (!text || text.length < 10) return false;
  
  // Check for code patterns
  const codePatterns = [
    /\b(function|const|let|var|def|class|import|export|if|else|for|while)\b/,
    /[{}();]/,
    /\b(int|string|void|public|private)\b/,
    /[<>\[\]]/,
    /\b(SELECT|FROM|WHERE|INSERT|UPDATE)\b/i,
    /#include|<[^>]+>/,
  ];
  
  const matches = codePatterns.reduce((count, pattern) => {
    return count + (pattern.test(text) ? 1 : 0);
  }, 0);
  
  return matches >= 2; // At least 2 code patterns suggest it's code
}

/**
 * Process extracted text using text worker
 * @param {string} codeText - The extracted code text
 */
async function processWithText(codeText) {
  try {
    console.log('[CodeLearner] Processing with text extraction...');
    
    // Initialize text worker if not ready
    if (!textReady && !textInitializing) {
      showLoadingPanel('Initializing text model...');
      initializeTextWorker();
      
      textWorker.postMessage({ type: 'initialize' });
      
      await waitForTextReady();
    }
    
    showLoadingPanel('Analyzing code...');
    
    // Send text to worker for processing
    return new Promise((resolve, reject) => {
      const messageHandler = (event) => {
        const { type, explanation, language, error } = event.data;
        
        if (type === 'result') {
          textWorker.removeEventListener('message', messageHandler);
          showTextPanel(codeText, explanation, language);
          resolve();
        } else if (type === 'error') {
          textWorker.removeEventListener('message', messageHandler);
          hideLoadingPanel();
          
          console.error('[CodeLearner] Text processing failed:', error);
          reject(new Error(error));
        }
      };
      
      textWorker.addEventListener('message', messageHandler);
      textWorker.postMessage({
        type: 'explain',
        data: { codeText: codeText }
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        textWorker.removeEventListener('message', messageHandler);
        hideLoadingPanel();
        reject(new Error('Text processing timeout'));
      }, 30000);
    });
    
  } catch (error) {
    console.error('[CodeLearner] Text processing error:', error);
    hideLoadingPanel();
    throw error;
  }
}

/**
 * Show loading panel with progress message
 */
function showLoadingPanel(message) {
  let panel = document.getElementById("learn-loading-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "learn-loading-panel";
    panel.style.cssText = "position:fixed; bottom:20px; right:20px; width:380px; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.3); z-index:1000000; padding:16px; font-family:sans-serif;";
    document.body.appendChild(panel);
  }
  
  panel.innerHTML = '';
  
  const p = document.createElement('p');
  p.style.cssText = 'margin:0; text-align:center;';
  p.textContent = message;
  
  const spinner = document.createElement('div');
  spinner.style.cssText = 'margin:12px auto; width:40px; height:40px; border:4px solid #f3f3f3; border-top:4px solid #FF006E; border-radius:50%; animation:spin 1s linear infinite;';
  
  // Add spinner animation
  if (!document.getElementById('spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
  
  panel.appendChild(p);
  panel.appendChild(spinner);
}

/**
 * Update loading panel message
 */
function updateLoadingPanel(message, status) {
  const panel = document.getElementById("learn-loading-panel");
  if (panel) {
    const p = panel.querySelector('p');
    if (p) {
      p.textContent = message;
    }
    
    // Hide spinner if ready
    if (status === 'ready') {
      setTimeout(() => hideLoadingPanel(), 1000);
    }
  }
}

/**
 * Hide loading panel
 */
function hideLoadingPanel() {
  const panel = document.getElementById("learn-loading-panel");
  if (panel) {
    panel.remove();
  }
}

function showTextPanel(codeText, explanation, language) {
  // Hide loading panel
  hideLoadingPanel();
  
  let panel = document.getElementById("learn-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "learn-panel";
    panel.style.cssText = "position:fixed; bottom:20px; right:20px; width:380px; max-height:80vh; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.3); z-index:1000000; padding:16px; overflow:auto; font-family:sans-serif;";
    document.body.appendChild(panel);
  }
  
  panel.innerHTML = '';
  
  // Show detected language
  if (language && language !== 'unknown') {
    const langBadge = document.createElement('div');
    langBadge.style.cssText = 'background:#e3f2fd; color:#1976d2; padding:4px 8px; border-radius:4px; font-size:12px; display:inline-block; margin-bottom:8px;';
    langBadge.textContent = language.toUpperCase();
    panel.appendChild(langBadge);
  }
  
  // Show code snippet
  const codeDiv = document.createElement('div');
  codeDiv.style.cssText = 'background:#f5f5f5; padding:12px; border-radius:8px; margin-bottom:12px; font-family:monospace; font-size:13px; white-space:pre-wrap; max-height:150px; overflow:auto; border-left:4px solid #FF006E;';
  codeDiv.textContent = codeText.length > 500 ? codeText.substring(0, 500) + '...' : codeText;
  panel.appendChild(codeDiv);
  
  const p = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = 'Explanation: ';
  p.appendChild(strong);
  
  // Split explanation by newlines and add them as separate text nodes with br elements
  const lines = explanation.split('\n');
  lines.forEach((line, index) => {
    const textNode = document.createTextNode(line);
    p.appendChild(textNode);
    if (index < lines.length - 1) {
      p.appendChild(document.createElement('br'));
    }
  });
  
  const button = document.createElement('button');
  button.id = 'close-learn-panel';
  button.textContent = 'Close & Reset';
  button.style.cssText = 'padding:8px 16px; background:#FF006E; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;';
  button.addEventListener('click', () => {
    panel.remove();
    questionCount = 0;
  });
  
  panel.appendChild(p);
  panel.appendChild(button);
}
