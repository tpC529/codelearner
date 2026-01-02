// Use browser API for cross-browser compatibility (Chrome, Firefox, Safari)
const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

let selecting = false;
let startX, startY;
let questionCount = 0;
const overlay = document.createElement("div");
overlay.style.cssText = "position:absolute; border:3px solid #FF006E; background:rgba(255,0,110,0.15); pointer-events:none; z-index:9999999; display:none;";
document.body.appendChild(overlay);

// Model worker state
let modelWorker = null;
let modelReady = false;
let modelInitializing = false;

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

// Initialize worker on content script load
initializeModelWorker();

document.addEventListener("mousedown", e => {
  if (e.shiftKey) {
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

  // Request screenshot from background script
  try {
    const response = await browserAPI.runtime.sendMessage({action: "capture"});
    console.log("[CodeLearner] Response:", response);
    
    if (!response || typeof response === 'object' && response.error) {
      console.error("[CodeLearner] Screenshot capture failed:", response?.error);
      alert("Screenshot capture failed: " + (response?.error || "No response"));
      return;
    }
    
    const screenshot = response;

    if (questionCount >= 3) {
      alert("Limit reached (3 questions). Reload page to reset.");
      return;
    }

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

    questionCount++;
  } catch (error) {
    console.error("[CodeLearner] Error:", error);
    alert("Error: " + error.message);
  }
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
 * Wait for model to be ready
 */
function waitForModelReady() {
  return new Promise((resolve, reject) => {
    const checkReady = () => {
      if (modelReady) {
        resolve();
      } else if (!modelInitializing && !modelReady) {
        reject(new Error('Model initialization failed'));
      } else {
        setTimeout(checkReady, 500);
      }
    };
    checkReady();
    
    // Timeout after 5 minutes (for slow downloads)
    setTimeout(() => reject(new Error('Model initialization timeout')), 300000);
  });
}

/**
 * Crop image to coordinates in main thread (Canvas API not available in workers)
 */
async function cropImageInMainThread(imageData, coords) {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const [x1, y1, x2, y2] = coords;
        const width = x2 - x1;
        const height = y2 - y1;
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw cropped region
        ctx.drawImage(img, x1, y1, width, height, 0, 0, width, height);
        
        // Convert to data URL
        const croppedData = canvas.toDataURL('image/png');
        resolve(croppedData);
      };
      img.onerror = reject;
      img.src = imageData;
    } catch (error) {
      reject(error);
    }
  });
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

function showFloatingPanel(imgSrc, text) {
  // Hide loading panel
  hideLoadingPanel();
  
  let panel = document.getElementById("learn-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "learn-panel";
    panel.style.cssText = "position:fixed; bottom:20px; right:20px; width:380px; max-height:80vh; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.3); z-index:1000000; padding:16px; overflow:auto; font-family:sans-serif;";
    document.body.appendChild(panel);
  }
  
  // Validate imgSrc is a safe data URI (base64 encoded PNG)
  if (!imgSrc || !imgSrc.startsWith('data:image/png;base64,')) {
    console.error("[CodeLearner] Invalid image source");
    return;
  }
  
  // Create elements safely without innerHTML for better security
  panel.innerHTML = '';
  
  const img = document.createElement('img');
  img.src = imgSrc;
  img.style.cssText = 'max-width:100%; border-radius:8px; margin-bottom:12px;';
  
  const p = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = 'Explanation: ';
  p.appendChild(strong);
  
  // Split text by newlines and add them as separate text nodes with br elements
  const lines = text.split('\n');
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
  
  panel.appendChild(img);
  panel.appendChild(p);
  panel.appendChild(button);
}
