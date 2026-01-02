# CodeLearner

Highlight code blocks and get an explanation from an AI model running directly in your browser! This browser extension works across multiple browsers including Chrome, Firefox, Edge, Safari, Brave, and DuckDuckGo.

## Features

- **Browser-Based AI**: AI models run directly in your browser - no server setup required! 🚀
- **Cross-Browser Support**: Compatible with Chrome, Firefox, Edge, Safari, Brave, and DuckDuckGo
- **Simple Selection**: Hold Shift + drag to select any code or UI element on a webpage
- **GPU Acceleration**: Uses WebGPU/WebGL for fast inference on all GPUs including older hardware
- **Complete Privacy**: All processing happens in your browser - no data ever leaves your device
- **Offline Capable**: Works offline after the first model download
- **Secure**: Includes XSS protection and follows browser security best practices

## Installation

### Chrome, Edge, Brave, or Other Chromium-Based Browsers

1. Clone this repository
2. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension is now installed and ready to use!

### Firefox

1. Clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the extension directory
5. The extension is now installed temporarily (will be removed when Firefox restarts)

For permanent installation in Firefox, you'll need to package and sign the extension through AMO (addons.mozilla.org).

### Safari

1. **Convert to Safari Extension**:
   ```bash
   # macOS only - requires Xcode Command Line Tools
   xcrun safari-web-extension-converter /path/to/extension --app-name "LearnByHover"
   ```

2. **Build and Run**:
   - Open the generated Xcode project
   - Build and run the project (Cmd+R)
   - Enable the extension in Safari:
     - Open Safari → Preferences → Extensions
     - Enable "LearnByHover"
     - Grant necessary permissions

3. **For Development**:
   - Keep the Xcode project running while testing
   - Reload the extension after making changes

**Note**: Safari requires extensions to be wrapped in a macOS app. The safari-web-extension-converter tool creates this wrapper automatically.

### DuckDuckGo Browser

The DuckDuckGo browser for desktop and mobile supports web extensions:

**Desktop (macOS/Windows):**
1. DuckDuckGo browser uses the same extension installation as Chromium-based browsers
2. Navigate to the extensions page or settings
3. Follow the same steps as Chrome/Brave installation above

**Mobile:**
DuckDuckGo mobile browser has limited extension support. Currently, the extension requires desktop browser APIs (tabs, screenshot capture) that are not available on mobile browsers.

## Setup

**🎉 No Setup Required!**

The extension now uses browser-based AI models that run directly in your browser. Just install the extension and you're ready to go!

### First Use

On your first use, the extension will:
1. Download the AI model (~80-500MB depending on the model chosen)
2. Cache it in your browser for future use
3. This only happens once - subsequent uses are instant!

### Optional: Legacy Backend Mode

If you prefer to use the original Python backend with Ollama:

1. Open the extension settings (click the extension icon or go to options)
2. Change "Inference Mode" to "Backend Mode (Legacy)"
3. Follow the backend setup instructions below

#### Backend Setup (Legacy Mode Only)

1. **Install Ollama**: Follow instructions at https://ollama.ai
2. **Pull the model**:
   ```bash
   ollama pull moondream:1.8b
   ```
3. **Install Python dependencies**:
   ```bash
   pip install fastapi uvicorn pillow ollama python-multipart
   ```
4. **Start the backend**:
   ```bash
   python backend.py
   ```
   The server will run on http://127.0.0.1:8000

## Usage

1. Navigate to any webpage with code
2. Hold **Shift** and drag your mouse to select the code area
3. Release the mouse to capture the selection
4. Wait for the AI-powered explanation to appear in a floating panel
5. You can ask up to 3 questions per page load

## Performance

### Browser-Based Mode (Default)
- **First Use**: 15-60 seconds (model download + initialization)
- **Subsequent Uses**: 2-5 seconds (model cached, instant load)
- **Hardware Acceleration**: Uses WebGPU/WebGL for GPU acceleration
- **Works on**: All modern GPUs including older hardware like Intel Iris Xe

### Backend Mode (Legacy)
- **Inference Time**: 8-12 seconds per query
- **Requires**: Python backend running locally
- **Hardware**: Depends on Ollama performance

## Security Features

- **Content Security Policy (CSP)**: Prevents unauthorized script execution
- **XSS Protection**: All user-generated content is sanitized before display
- **Browser-Based Processing**: All AI inference happens in your browser (no external servers)
- **Minimal Permissions**: Only requests necessary browser permissions

## Privacy

This extension prioritizes your privacy. All code analysis is performed entirely in your browser. No data ever leaves your device. See our [Privacy Policy](PRIVACY.md) for details.

## Browser Compatibility

| Browser | Version | Support Status | AI Acceleration |
|---------|---------|----------------|-----------------|
| Chrome  | 113+    | ✅ Fully supported | WebGPU + WebGL |
| Edge    | 113+    | ✅ Fully supported | WebGPU + WebGL |
| Brave   | 1.52+   | ✅ Fully supported | WebGPU + WebGL |
| Firefox | 118+    | ✅ Fully supported | WebGL |
| Safari  | 16+     | ✅ Fully supported | WebGL |
| DuckDuckGo Desktop | Latest | ✅ Fully supported | WebGPU + WebGL |
| DuckDuckGo Mobile | N/A | ❌ Not supported | N/A |

## How It Works

The extension uses [Transformers.js](https://huggingface.co/docs/transformers.js) to run vision-language models directly in your browser:

1. **Model**: ViT-GPT2 image captioning (quantized for efficiency)
2. **Inference**: WebGPU/WebGL acceleration for fast processing
3. **Caching**: Models cached in IndexedDB after first download
4. **Privacy**: All processing happens locally in your browser

## Development

The extension uses Manifest V3 format for maximum compatibility and security. It includes:

- Cross-browser API support (works with both `chrome` and `browser` namespaces)
- Service worker-based background script
- Web Workers for non-blocking AI inference
- Content security policy for WebAssembly and WebGPU
- Proper icon assets

## Troubleshooting

### Extension not working?
- **Browser-Based Mode**: Wait for the model to download on first use (progress shown in loading panel)
- **Backend Mode**: Ensure the backend server is running on http://127.0.0.1:8000
- Check browser console for error messages
- Verify all permissions are granted

### Model download failed?
- Check your internet connection
- Try reloading the page
- Clear browser cache and try again
- Switch to backend mode in settings as fallback

### Safari-specific issues?
- Ensure you've built and run the Xcode wrapper project
- Check that the extension is enabled in Safari Preferences
- Grant all requested permissions when prompted

### Performance issues?
- First use requires model download (one-time)
- Ensure WebGL/WebGPU is enabled in your browser
- Try closing other tabs to free up memory
- Switch to Florence-2-base model (smaller, faster) if available

## Technical Details

For technical details about the migration from backend to browser-based inference, see [MIGRATION_EVALUATION.md](MIGRATION_EVALUATION.md).

## License & Privacy

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

For information about data collection and privacy, see our [Privacy Policy](PRIVACY.md).
