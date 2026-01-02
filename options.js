// Use browser API for cross-browser compatibility (Chrome, Firefox, Safari)
const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

// Load saved settings
document.addEventListener('DOMContentLoaded', () => {
  browserAPI.storage.sync.get(['backendUrl', 'inferenceMode'], (result) => {
    document.getElementById('backendUrl').value = result.backendUrl || 'http://127.0.0.1:8000';
    document.getElementById('inferenceMode').value = result.inferenceMode || 'browser';
    
    // Show/hide backend settings based on mode
    toggleBackendSettings(result.inferenceMode || 'browser');
  });
});

// Toggle backend settings visibility
function toggleBackendSettings(mode) {
  const backendSettings = document.getElementById('backendSettings');
  if (mode === 'backend') {
    backendSettings.style.display = 'block';
  } else {
    backendSettings.style.display = 'none';
  }
}

// Handle inference mode change
document.getElementById('inferenceMode').addEventListener('change', (e) => {
  toggleBackendSettings(e.target.value);
});

// Save settings
document.getElementById('save').addEventListener('click', () => {
  const backendUrl = document.getElementById('backendUrl').value.trim();
  const inferenceMode = document.getElementById('inferenceMode').value;
  
  // Validate backend URL if backend mode is selected
  if (inferenceMode === 'backend') {
    if (!backendUrl) {
      const status = document.getElementById('status');
      status.textContent = 'Please enter a valid backend URL';
      status.style.color = 'red';
      setTimeout(() => status.textContent = '', 2000);
      return;
    }
    
    // Validate URL format
    try {
      new URL(backendUrl);
    } catch (e) {
      const status = document.getElementById('status');
      status.textContent = 'Invalid URL format';
      status.style.color = 'red';
      setTimeout(() => status.textContent = '', 2000);
      return;
    }
  }
  
  // Remove trailing slash if present
  const cleanUrl = backendUrl.replace(/\/$/, '');
  
  browserAPI.storage.sync.set({ 
    backendUrl: cleanUrl,
    inferenceMode: inferenceMode
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Settings saved! Reload pages for changes to take effect.';
    status.style.color = 'green';
    setTimeout(() => status.textContent = '', 3000);
  });
});
