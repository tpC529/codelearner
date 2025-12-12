// Use browser API for cross-browser compatibility (Chrome, Firefox, Safari)
const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

console.log("[CodeLearner Background] Service worker started");

browserAPI.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("[CodeLearner Background] Message received:", msg);
  
  if (msg.action === "capture") {
    console.log("[CodeLearner Background] Attempting to capture tab...");
    console.log("[CodeLearner Background] Sender tab:", sender.tab);
    
    // Get the active tab
    browserAPI.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length === 0) {
        console.error("[CodeLearner Background] No active tab found");
        sendResponse({error: "No active tab"});
        return;
      }
      
      browserAPI.tabs.captureVisibleTab(tabs[0].windowId, {format: "png"}, (screenshot) => {
        if (browserAPI.runtime.lastError) {
          console.error("[CodeLearner Background] Error:", browserAPI.runtime.lastError.message);
          sendResponse({error: browserAPI.runtime.lastError.message});
        } else {
          console.log("[CodeLearner Background] Screenshot captured, length:", screenshot?.length);
          sendResponse(screenshot);
        }
      });
    });
    return true; // Keep message channel open for async response
  }
  
  sendResponse({error: "Unknown action"});
  return false;
});
