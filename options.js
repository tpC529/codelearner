// Default backend URL
const DEFAULT_BACKEND_URL = "http://localhost:8000";

// Load saved settings
function loadOptions() {
  chrome.storage.sync.get({
    backendUrl: DEFAULT_BACKEND_URL
  }, (items) => {
    document.getElementById('backendUrl').value = items.backendUrl;
  });
}

// Save settings
function saveOptions() {
  const backendUrl = document.getElementById('backendUrl').value.trim();
  
  // Validate URL
  if (!backendUrl) {
    showStatus('Please enter a backend URL', 'error');
    return;
  }
  
  // Remove trailing slash if present
  const cleanUrl = backendUrl.replace(/\/$/, '');
  
  chrome.storage.sync.set({
    backendUrl: cleanUrl
  }, () => {
    showStatus('Settings saved successfully!', 'success');
    setTimeout(() => {
      hideStatus();
    }, 3000);
  });
}

// Reset to default settings
function resetOptions() {
  document.getElementById('backendUrl').value = DEFAULT_BACKEND_URL;
  chrome.storage.sync.set({
    backendUrl: DEFAULT_BACKEND_URL
  }, () => {
    showStatus('Settings reset to default', 'success');
    setTimeout(() => {
      hideStatus();
    }, 3000);
  });
}

// Show status message
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
  status.style.display = 'block';
}

// Hide status message
function hideStatus() {
  const status = document.getElementById('status');
  status.style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions);

// Allow Enter key to save
document.getElementById('backendUrl').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    saveOptions();
  }
});
