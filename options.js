// Use browser API for cross-browser compatibility (Chrome, Firefox, Safari)
const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

// Load saved settings
document.addEventListener('DOMContentLoaded', () => {
  browserAPI.storage.sync.get(['backendUrl'], (result) => {
    document.getElementById('backendUrl').value = result.backendUrl || 'http://127.0.0.1:8000';
  });
});

// Save settings
document.getElementById('save').addEventListener('click', () => {
  const backendUrl = document.getElementById('backendUrl').value.trim();
  
  // Validate URL
  if (!backendUrl) {
    const status = document.getElementById('status');
    status.textContent = 'Please enter a valid URL';
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
  
  // Remove trailing slash if present
  const cleanUrl = backendUrl.replace(/\/$/, '');
  
  browserAPI.storage.sync.set({ backendUrl: cleanUrl }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Settings saved!';
    status.style.color = 'green';
    setTimeout(() => status.textContent = '', 2000);
  });
});
