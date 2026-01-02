# Installation Notes

## Version 2.0 - Browser-Based AI

Version 2.0 introduces browser-based AI inference using Transformers.js. This means:

- ✅ **No Python backend required** (by default)
- ✅ **No Ollama installation needed** (by default)
- ✅ **Works out of the box** - just install the extension
- ✅ **Backward compatible** - can still use Python backend if preferred

## Quick Start

1. Install the browser extension (see README.md for browser-specific instructions)
2. Navigate to any webpage with code
3. Hold Shift + drag to select code
4. Wait for model to download on first use (~15-60 seconds)
5. Subsequent uses are instant!

## First Use

On your first use of the extension, it will:
1. Download an AI model from Hugging Face CDN (~80-500MB)
2. Cache the model in your browser's IndexedDB
3. Initialize the model for inference

**This only happens once.** After the first download, the extension works offline and loads instantly.

## Browser Requirements

### WebGPU Support (Best Performance)
- Chrome 113+
- Edge 113+
- Brave 1.52+

### WebGL Support (Good Performance)
- Chrome 88+
- Firefox 118+
- Safari 16+
- Edge 88+
- All modern browsers

### Minimum Requirements
- 2GB+ RAM available
- 500MB+ free disk space (for model cache)
- Modern browser with WebGL support

## Storage

The extension uses browser storage for:
- **IndexedDB**: Cached AI models (80-500MB)
- **Chrome Sync Storage**: User settings (<1KB)

To clear cached models:
- Chrome: Settings → Privacy → Clear browsing data → "Hosted app data"
- Firefox: Settings → Privacy → Clear Data → "Offline Website Data"

## Inference Modes

### Browser-Based Mode (Default, Recommended)
- No installation beyond the extension
- AI runs in your browser using WebGPU/WebGL
- Fast on modern GPUs (2-5 seconds)
- Works offline after first model download
- Complete privacy (no network requests after download)

### Backend Mode (Legacy, Optional)
- Requires Python + Ollama installation
- Uses moondream:1.8b model via Ollama
- Slower than browser-based mode (8-12 seconds)
- Requires backend server running locally

To enable backend mode:
1. Open extension options
2. Change "Inference Mode" to "Backend Mode"
3. Follow backend setup instructions below

## Backend Setup (Only for Legacy Mode)

If you choose to use backend mode:

1. **Install Ollama**: https://ollama.ai
2. **Pull model**: `ollama pull moondream:1.8b`
3. **Install Python deps**: `pip install fastapi uvicorn pillow ollama python-multipart`
4. **Start backend**: `python backend.py`
5. **Configure extension**: Set backend URL in options (default: http://127.0.0.1:8000)

## Firefox-Specific Configuration

The `browser_specific_settings.gecko.id` field in `manifest.json` uses a placeholder value (`learnbyhover@example.com`). 

### For Development:
The placeholder is fine for local testing and temporary add-ons.

### For Production (publishing to AMO):
You should replace it with:
1. A valid email-style ID using a domain you control (e.g., `extension@yourdomain.com`)
2. OR follow Mozilla's UUID format: `{<UUID>}` (e.g., `{12345678-1234-1234-1234-123456789abc}`)

Generate a UUID using:
```bash
uuidgen  # On macOS/Linux
```

Or:
```bash
python3 -c "import uuid; print('{' + str(uuid.uuid4()) + '}')"
```

Update the manifest.json with your chosen ID before publishing to addons.mozilla.org (AMO).

## Safari-Specific Notes

Safari extensions must be packaged within a macOS app. Use the `safari-web-extension-converter` tool as documented in the README.md file.

The browser-based AI works in Safari using WebGL acceleration (WebGPU support coming in future Safari versions).

## Troubleshooting

### Model download fails
- Check internet connection
- Try reloading the page
- Clear browser cache and retry
- Check available disk space (need 500MB+)
- Fallback: Enable backend mode in settings

### Out of memory errors
- Close other tabs to free memory
- Try clearing browser cache
- Consider using backend mode instead

### Performance issues
- Ensure WebGL is enabled in browser settings
- Update graphics drivers
- Try Chrome/Edge for WebGPU support
- Consider backend mode for very old hardware

### Extension not loading
- Check browser console for errors
- Verify extension permissions are granted
- Try reinstalling the extension
- Check browser version compatibility

## Migration from v1.0

If you're upgrading from version 1.0:

1. **No action required** - extension will use browser mode by default
2. **Keep backend running** if you want to use legacy mode
3. **Change setting** to "Backend Mode" if you prefer the old behavior
4. **First use** will download model (one-time, 15-60 seconds)

## Development Notes

### Model Worker

The `model-worker.js` file runs in a Web Worker thread to avoid blocking the UI. It:
- Loads Transformers.js from CDN
- Initializes vision-language models
- Processes images for code analysis
- Reports progress during download/initialization

### Content Security Policy

The manifest includes `'wasm-unsafe-eval'` in CSP to allow WebAssembly execution needed for Transformers.js.

### Web Accessible Resources

The `model-worker.js` file is declared as a web accessible resource so it can be loaded as a module worker.
