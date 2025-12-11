let selecting = false;
let startX, startY;
let questionCount = 0;
let backendUrl = "http://localhost:8000"; // Default, will be loaded from storage

// Load backend URL from storage
chrome.storage.sync.get({backendUrl: "http://localhost:8000"}, (items) => {
  backendUrl = items.backendUrl;
  console.log("[CodeLearner] Backend URL loaded:", backendUrl);
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.backendUrl) {
    backendUrl = changes.backendUrl.newValue;
    console.log("[CodeLearner] Backend URL updated:", backendUrl);
  }
});

const overlay = document.createElement("div");
overlay.style.cssText = "position:absolute; border:3px solid #FF006E; background:rgba(255,0,110,0.15); pointer-events:none; z-index:9999999; display:none;";
document.body.appendChild(overlay);

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
    const response = await chrome.runtime.sendMessage({action: "capture"});
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

    console.log("[CodeLearner] Sending to backend...");
    console.log("[CodeLearner] Screenshot length:", screenshot.length);
    console.log("[CodeLearner] Using backend URL:", backendUrl);
    
    const res = await fetch(`${backendUrl}/api`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({image_b64: screenshot, coords, question_count: questionCount})
    }).catch(err => {
      console.error("[CodeLearner] Fetch error details:", err);
      console.error("[CodeLearner] Make sure backend is running at:", backendUrl);
      throw new Error(`Cannot connect to backend at ${backendUrl}. Please check that the backend server is running and the URL is correct in extension settings.`);
    });

    console.log("[CodeLearner] Response status:", res.status);
    const data = await res.json();
    console.log("[CodeLearner] Response data:", data);
    
    if (!res.ok) {
      console.error("[CodeLearner] Backend error:", JSON.stringify(data, null, 2));
      alert("Backend error: " + JSON.stringify(data.detail || data));
      return;
    }
    
    showFloatingPanel(data.highlighted, data.explanation);

    questionCount++;
  } catch (error) {
    console.error("[CodeLearner] Error:", error);
    alert("Error: " + error.message);
  }
});

function showFloatingPanel(imgSrc, text) {
  let panel = document.getElementById("learn-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "learn-panel";
    panel.style.cssText = "position:fixed; bottom:20px; right:20px; width:380px; max-height:80vh; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.3); z-index:1000000; padding:16px; overflow:auto; font-family:sans-serif;";
    document.body.appendChild(panel);
  }
  panel.innerHTML = `
    <img src="${imgSrc}" style="max-width:100%; border-radius:8px; margin-bottom:12px;">
    <p><strong>Explanation:</strong> ${text.replace(/\n/g, "<br>")}</p>
    <button id="close-learn-panel" style="padding:8px 16px; background:#FF006E; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Close & Reset</button>
  `;
  
  document.getElementById("close-learn-panel").addEventListener("click", () => {
    panel.remove();
    questionCount = 0;
  });
}
