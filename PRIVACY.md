# Privacy Policy

**Last Updated: January 2, 2026**

## Overview

CodeLearner (LearnByHover) is committed to protecting your privacy. This privacy policy explains how our browser extension handles data and what information (if any) we collect.

## Data Collection

**We do NOT collect, store, or transmit any of your data to external servers.**

CodeLearner is designed with privacy as a core principle. The extension:

- Does NOT collect personal information
- Does NOT track your browsing activity
- Does NOT send data to external servers
- Does NOT use analytics or tracking services
- Does NOT share information with third parties

## How the Extension Works

### Browser-Based Processing (Default Mode)

All code analysis and explanations are performed **entirely in your browser** using AI models that run locally. When you use CodeLearner:

1. You select a code snippet or UI element on a webpage
2. A screenshot of that selection is captured
3. The screenshot is processed **entirely in your browser** using Transformers.js
4. The local AI model analyzes the image and generates an explanation
5. The explanation is displayed in your browser

**At no point does any data leave your browser or device.**

### Model Download

On first use, the extension downloads an AI model from Hugging Face's CDN:
- This is a one-time download (80-500MB depending on model)
- The model is cached in your browser's storage (IndexedDB)
- Model files are public and contain no personal data
- After download, the extension works completely offline

### Legacy Backend Mode (Optional)

If you choose to enable "Backend Mode" in settings, the extension can use a Python backend running on your local machine (127.0.0.1):

1. Screenshots are sent **only** to your local backend server (127.0.0.1:8000)
2. The local Ollama AI model processes the image
3. The explanation is returned to your browser

**Even in backend mode, no data leaves your local machine or network.**

## Permissions Explained

The extension requires specific browser permissions to function. Here's why each permission is needed:

### activeTab Permission
- **Purpose**: Allows the extension to capture screenshots of the visible webpage content
- **Usage**: Only activates when you explicitly select code using Shift + drag
- **Data Access**: Limited to the current active tab, only when you trigger the extension

### tabs Permission
- **Purpose**: Enables the extension to interact with browser tabs for screenshot capture
- **Usage**: Required for the screenshot API to function properly
- **Data Access**: Does not access tab content beyond what's needed for screenshots

### storage Permission
- **Purpose**: Stores settings and cached AI models locally in your browser
- **Usage**: 
  - Saves your inference mode preference (browser vs backend)
  - Saves backend URL if using legacy mode
  - Caches downloaded AI models for offline use
- **Data Stored**: 
  - Settings: Inference mode and backend URL
  - AI Models: Cached model files (80-500MB) in IndexedDB
  - All data stored locally in your browser

**Important**: These permissions allow the extension to access webpage content, but all processing happens locally and no data is transmitted externally.

## Third-Party Services

CodeLearner uses minimal third-party services:

### Browser-Based Mode (Default)
- **Hugging Face CDN**: Used only for initial model download
  - One-time download on first use
  - Models are public and contain no personal data
  - After download, no further connection needed
  - Models cached locally for offline use

### No Other Services
- No analytics tools (e.g., Google Analytics)
- No crash reporting services
- No advertising networks
- No external APIs beyond initial model download
- No cloud services

### Legacy Backend Mode
- Uses Ollama running locally on your machine
- No external services involved
- All processing on localhost (127.0.0.1)

## Data Storage

The extension stores data locally in your browser:

### Browser-Based Mode
- **AI Model Cache**: Cached model files (80-500MB) in IndexedDB
- **Settings**: Inference mode preference (stored using Chrome/Firefox storage API)
- **Backend URL**: If using legacy mode (stored using Chrome/Firefox storage API)

### Data Lifecycle
- Model cache persists until you clear browser data
- Settings persist until you uninstall the extension or clear sync data
- No data is stored on external servers
- All data can be cleared through browser settings

## Security

CodeLearner implements several security measures:

- **Content Security Policy (CSP)**: Prevents unauthorized script execution, allows WebAssembly for AI models
- **XSS Protection**: All content is sanitized before display
- **Local-Only Processing**: No external network requests except initial model download
- **Minimal Permissions**: Only requests necessary browser permissions
- **Web Workers**: AI processing runs in isolated worker threads
- **Sandboxed Execution**: Models run in browser's WebAssembly/WebGPU sandbox

## Your Rights

Since we do not collect any personal data, there is no personal information to access, modify, or delete. You maintain complete control over:

- The extension installation (you can uninstall at any time)
- Your local AI model cache (can be cleared through browser settings)
- Your settings (can be reset through extension options)
- All local storage used by the extension (can be cleared through browser settings)

### Clearing Extension Data

To clear all data stored by the extension:

1. **Chrome/Edge/Brave**: Settings → Privacy → Clear browsing data → Check "Hosted app data" and "IndexedDB"
2. **Firefox**: Settings → Privacy → Clear Data → Check "Offline Website Data"
3. **Safari**: Safari → Preferences → Privacy → Manage Website Data

## Compliance

This privacy policy is designed to comply with:

- Chrome Web Store Developer Program Policies
- Firefox Add-ons Policies
- Microsoft Edge Add-ons Policies
- Apple App Store Review Guidelines
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

Since CodeLearner processes data entirely locally in your browser and does not collect any user data, it inherently complies with most privacy regulations.

## Privacy Improvements in Version 2.0

Version 2.0 introduces browser-based AI inference, which significantly enhances privacy:

- ✅ **No local server required**: Eliminates need for Python backend (optional)
- ✅ **Complete browser isolation**: All processing in browser sandbox
- ✅ **Offline capable**: Works without network after model download
- ✅ **Faster**: No localhost network requests
- ✅ **More secure**: Reduced attack surface (no local server)

## Open Source

CodeLearner is open source software. You can review the complete source code, including how data is handled, at:

[https://github.com/tpC529/codelearner](https://github.com/tpC529/codelearner)

Transparency is important to us, and we encourage users to review the code to verify our privacy practices.
