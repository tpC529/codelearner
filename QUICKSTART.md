# Quick Start Guide

Get LearnByHover up and running in 5 minutes!

## Prerequisites

- A Chromium-based browser (Chrome, Edge, Brave, Opera) or Firefox
- Python 3.8+
- 4GB+ RAM for running the AI model

## Step 1: Install Ollama

Ollama runs the AI model locally on your machine.

### macOS
```bash
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows
Download from https://ollama.ai/download

## Step 2: Download the AI Model

```bash
ollama pull moondream:1.8b
```

This downloads a 1.8GB vision model. It may take a few minutes.

## Step 3: Install Python Dependencies

```bash
pip install fastapi uvicorn pillow ollama python-multipart
```

## Step 4: Start the Backend

In the repository directory:

```bash
python backend.py
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Leave this terminal running!

## Step 5: Install the Extension

### Chrome/Edge/Brave/Opera

1. Open your browser
2. Navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
   - Opera: `opera://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `codelearner` folder (where `manifest.json` is located)

### Firefox

1. Open Firefox
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select the `manifest.json` file from the `codelearner` folder

## Step 6: Try It Out!

1. Open any webpage with code (or use the included test page)
2. Hold **Shift** key
3. Click and drag to select any code or UI element
4. Wait 2-3 seconds for the AI explanation
5. View the result in the floating panel

### Test Page

For a quick test:
```bash
python serve_test.py
```

Then open http://localhost:8080/test.html

## Troubleshooting

### "Screenshot capture failed"
- Make sure you're on a regular webpage (not chrome:// or about:// pages)
- Try reloading the page

### "Fetch error" or "Network error"
- Ensure the backend is running (`python backend.py`)
- Check that it's running on http://127.0.0.1:8000
- Verify no firewall is blocking the connection

### "Extension not loading"
- Check browser console for errors
- Ensure all files are in the same directory
- Try removing and re-adding the extension

### AI responses are slow
- First run is slower (model initialization)
- Ensure you have enough RAM (4GB+)
- Consider using a smaller selection area

### Extension not working on some sites
- Some websites have strict CSP (Content Security Policy)
- Try a different website
- Check browser console for errors

## Usage Tips

- **Smaller selections** = faster responses
- **Code snippets** work better than full pages
- **Clear elements** get better explanations
- Use the **Close & Reset** button to ask more questions

## What's Next?

- Read the [full README](README.md) for more details
- Check [DISTRIBUTION.md](DISTRIBUTION.md) to publish the extension
- Report issues on [GitHub](https://github.com/tpC529/codelearner)
- Customize the AI prompt in `backend.py`

## Uninstalling

### Remove Extension
Go to your browser's extension page and click Remove/Delete

### Uninstall Dependencies
```bash
pip uninstall fastapi uvicorn pillow ollama python-multipart
```

### Remove Ollama Model
```bash
ollama rm moondream:1.8b
```

## Need Help?

- Check existing [GitHub Issues](https://github.com/tpC529/codelearner/issues)
- Create a new issue with details about your problem
- Include browser version, OS, and error messages
