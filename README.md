# CodeLearner (LearnByHover)

AI-powered code and UI explanations for any webpage! Hold Shift and drag to select code or UI elements, then get instant explanations powered by local AI.

## Features

- 🎯 **Select & Learn**: Hold Shift + drag over any code or UI element
- 🤖 **AI-Powered**: Get intelligent explanations using Ollama's Moondream model
- 🌐 **Works Everywhere**: Compatible with all major browsers (Chrome, Firefox, Edge, Brave, Opera)
- 🔒 **Privacy-First**: Uses local AI model - your code never leaves your machine
- ⚡ **Fast & Lightweight**: Minimal performance impact on browsing

## Installation

### Install the Extension

#### Chrome, Edge, Brave, Opera
1. Clone this repository
2. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
   - Opera: `opera://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `codelearner` directory

#### Firefox
1. Clone this repository
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the `codelearner` directory

### Setup the Backend

1. Install dependencies:
   ```bash
   pip install fastapi uvicorn pillow ollama python-multipart
   ```

2. Install Ollama and pull the model:
   ```bash
   # Install Ollama from https://ollama.ai
   ollama pull moondream:1.8b
   ```

3. Start the backend server:
   ```bash
   python backend.py
   ```

The backend will run on `http://127.0.0.1:8000`

## Usage

1. Ensure the backend server is running
2. Navigate to any webpage with code or UI elements
3. Hold **Shift** key
4. Click and drag to select the area you want to learn about
5. Wait for the AI to analyze and explain the selection
6. View the explanation in the floating panel

## Testing

You can use the included test page to try out the extension:

```bash
python serve_test.py
```

Then open http://localhost:8080/test.html in your browser.

## Browser Compatibility

This extension is built with Manifest V3 and works on:
- ✅ Google Chrome (88+)
- ✅ Microsoft Edge (88+)
- ✅ Brave Browser
- ✅ Opera (74+)
- ✅ Firefox (109+) - May require minor adjustments for full compatibility

## Architecture

- **content.js**: Handles user interactions and selection overlay
- **background.js**: Service worker for screenshot capture
- **backend.py**: FastAPI server that processes images with AI
- **manifest.json**: Extension configuration

## Privacy & Security

- All processing happens locally on your machine
- No data is sent to external servers
- Screenshots are only used temporarily for AI analysis
- Open source - audit the code yourself!

## License

Open source - feel free to use and modify!

