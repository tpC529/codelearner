# CodeLearner - LearnByHover Extension

Highlight code blocks and UI elements to get AI-powered explanations instantly!

## Features

- 🎯 **Visual Selection**: Hold Shift and drag to select any code or UI element
- 🤖 **AI Explanations**: Get instant explanations powered by AI vision models
- 🌐 **Cross-Browser Support**: Works on Chrome, Edge, Brave, Firefox, and other modern browsers
- ⚙️ **Configurable**: Set your own backend server URL in extension settings

## Installation

### For Chrome, Edge, Brave, and Chromium-based browsers:

1. **Download or Clone this repository**
   ```bash
   git clone https://github.com/tpC529/codelearner.git
   cd codelearner
   ```

2. **Open Extension Management Page**
   - **Chrome**: Navigate to `chrome://extensions/`
   - **Edge**: Navigate to `edge://extensions/`
   - **Brave**: Navigate to `brave://extensions/`

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `codelearner` directory

5. **Configure Backend URL** (Optional)
   - Click the extension icon and select "Options" or right-click the extension and choose "Options"
   - Enter your backend server URL (default: `http://localhost:8000`)
   - Click "Save Settings"

### For Firefox:

1. **Download or Clone this repository** (same as above)

2. **Open Add-ons Debug Page**
   - Navigate to `about:debugging#/runtime/this-firefox`

3. **Load Temporary Add-on**
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the `codelearner` directory

**Note**: In Firefox, temporary add-ons are removed when you close the browser. For permanent installation, you would need to package and sign the extension through Mozilla Add-ons.

## Setup Backend Server

The extension requires a backend server to process screenshots and provide AI explanations.

### Prerequisites

- Python 3.8+
- Ollama with moondream model

### Installation

1. **Install Python dependencies**
   ```bash
   pip install fastapi uvicorn pillow ollama python-multipart
   ```

2. **Install Ollama and download the model**
   ```bash
   # Install Ollama (see https://ollama.ai for your OS)
   # Then pull the moondream model:
   ollama pull moondream:1.8b
   ```

3. **Start the backend server**
   ```bash
   python backend.py
   ```

   The server will start on `http://localhost:8000`

4. **Configure the extension** (if using a different URL)
   - Open extension options
   - Set your backend URL
   - Save settings

## Usage

1. **Ensure the backend server is running**
   ```bash
   python backend.py
   ```

2. **Navigate to any webpage**

3. **Select an element**
   - Hold the **Shift** key
   - Click and drag over any code block, UI element, or text
   - Release the mouse

4. **View the explanation**
   - A floating panel will appear with the AI's explanation
   - You can ask up to 3 questions per page load
   - Click "Close & Reset" to reset the counter

## Testing

A test page is provided to try the extension:

1. **Start the test server**
   ```bash
   python serve_test.py
   ```

2. **Open the test page**
   - Navigate to `http://localhost:8080/test.html`

3. **Test the extension**
   - Hold Shift and drag over the sample code or UI elements

## Browser Compatibility

This extension is compatible with:

- ✅ Google Chrome (version 88+)
- ✅ Microsoft Edge (version 88+)
- ✅ Brave Browser
- ✅ Opera
- ✅ Chromium-based browsers
- ✅ Firefox (version 109+) - with temporary installation

## Troubleshooting

### "Cannot connect to backend" error

- Ensure the backend server is running: `python backend.py`
- Check the backend URL in extension options matches your server
- Verify the backend is accessible (try opening `http://localhost:8000` in your browser)

### Extension not working in Brave

- Make sure you've enabled the extension in Brave's extension settings
- Check that "Site and shield settings" allow the extension on the current page
- Verify the backend URL is correctly configured

### Extension not working in Edge

- Ensure you've granted all required permissions
- Check Edge's extension settings and confirm the extension is enabled
- Try reloading the extension or restarting Edge

### "Screenshot capture failed" error

- The extension needs permission to capture the current tab
- Make sure you've granted the "activeTab" permission
- Try reloading the page and the extension

## Development

### Project Structure

```
codelearner/
├── manifest.json          # Extension manifest (V3)
├── background.js          # Service worker for screenshot capture
├── content.js            # Content script for UI interaction
├── options.html          # Options page UI
├── options.js            # Options page logic
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── backend.py            # FastAPI backend server
├── serve_test.py         # Test page server
└── test.html            # Test page
```

### Building for Production

For production distribution:

1. **Remove development files** (optional)
   - `serve_test.py`
   - `test.html`
   - `create_icons.py`

2. **Package the extension**
   - Zip the directory contents
   - Submit to browser web stores

3. **Chrome Web Store**: https://chrome.google.com/webstore/devconsole
4. **Edge Add-ons**: https://partner.microsoft.com/en-us/dashboard/microsoftedge
5. **Firefox Add-ons**: https://addons.mozilla.org/developers

## License

MIT License - feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

