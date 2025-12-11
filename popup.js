// Load and display current backend URL
function loadBackendUrl() {
  chrome.storage.sync.get({
    backendUrl: "http://localhost:8000"
  }, (items) => {
    document.getElementById('backendUrl').textContent = items.backendUrl;
  });
}

// Open options page
document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Open test page (only works if test server is running)
document.getElementById('testPage').addEventListener('click', () => {
  // Load test page URL from storage, fallback to default
  chrome.storage.sync.get({
    testPageUrl: 'http://localhost:8080/test.html'
  }, (items) => {
    chrome.tabs.create({
      url: items.testPageUrl
    });
  });
});

// Load backend URL on popup open
document.addEventListener('DOMContentLoaded', loadBackendUrl);

// Update backend URL if changed
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.backendUrl) {
    document.getElementById('backendUrl').textContent = changes.backendUrl.newValue;
  }
});
