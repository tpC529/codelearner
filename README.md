# CodeLearner

Highlight code blocks and get an explanation from an LLM. This browser extension works across multiple browsers including Chrome, Firefox, Edge, Safari, Brave, and DuckDuckGo.

## Features

- **Cross-Browser Support**: Compatible with Chrome, Firefox, Edge, Safari, Brave, and DuckDuckGo
- **Simple Selection**: Hold Shift + drag to select any code or UI element on a webpage
- **AI-Powered Explanations**: Get instant explanations powered by local LLM
- **Privacy-Focused**: Uses local backend with Ollama for privacy
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

## Backend Setup

The extension requires a local backend server running Ollama:

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

## Security Features

- **Content Security Policy (CSP)**: Prevents unauthorized script execution
- **XSS Protection**: All user-generated content is sanitized before display
- **Local Processing**: Uses local backend for privacy (no data sent to external servers)
- **Minimal Permissions**: Only requests necessary browser permissions

## Browser Compatibility

| Browser | Version | Support Status |
|---------|---------|----------------|
| Chrome  | 88+     | ✅ Fully supported |
| Edge    | 88+     | ✅ Fully supported |
| Brave   | 1.0+    | ✅ Fully supported (Chromium-based) |
| Firefox | 109+    | ✅ Fully supported |
| Safari  | 14.1+   | ✅ Fully supported (requires conversion) |
| DuckDuckGo Desktop | Latest | ✅ Fully supported (Chromium-based) |
| DuckDuckGo Mobile | N/A | ❌ Not supported (limited extension API) |

## Development

The extension uses Manifest V3 format for maximum compatibility and security. It includes:

- Cross-browser API support (works with both `chrome` and `browser` namespaces)
- Service worker-based background script
- Content security policy
- Proper icon assets

## Troubleshooting

### Extension not working?
- Ensure the backend server is running on http://127.0.0.1:8000
- Check browser console for error messages
- Verify all permissions are granted

### Safari-specific issues?
- Ensure you've built and run the Xcode wrapper project
- Check that the extension is enabled in Safari Preferences
- Grant all requested permissions when prompted

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
