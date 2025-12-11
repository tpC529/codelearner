# Testing Guide for LearnByHover Extension

This guide helps you test the extension in different browsers to ensure everything works correctly.

## Prerequisites

Before testing:
1. Backend server running: `python backend.py` (should be on port 8000)
2. Ollama with moondream:1.8b model installed and running
3. Browser(s) installed: Chrome, Edge, Brave, or Firefox

## Quick Validation

Run the validation script first:
```bash
python3 validate_extension.py
```

All checks should pass ✓

## Testing in Chrome/Edge/Brave

### Installation
1. Open browser extension page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`

2. Enable "Developer mode" (toggle in top right)

3. Click "Load unpacked"

4. Select the `codelearner` directory

5. Verify the extension loads without errors

### Test Cases

#### Test 1: Extension Loads
- [x] Extension icon appears in toolbar (pink with brackets)
- [x] No errors in browser console
- [x] Extension shows in extensions list

#### Test 2: Popup UI
- [x] Click extension icon
- [x] Popup opens with instructions
- [x] Backend URL is displayed
- [x] "Open Settings" button works
- [x] "Open Test Page" button works (if test server running)

#### Test 3: Options Page
- [x] Right-click extension icon → Options
- [x] Options page opens
- [x] Current backend URL is displayed
- [x] Can edit URL
- [x] "Save Settings" button works
- [x] "Reset to Default" button works
- [x] Success message appears after saving

#### Test 4: Core Functionality

**Setup:**
1. Ensure backend is running: `python backend.py`
2. Optional: Start test server: `python serve_test.py`
3. Navigate to `http://localhost:8080/test.html` or any website

**Test:**
1. Hold **Shift** key
2. Click and drag over a code block or UI element
3. Release mouse
4. Wait for processing

**Expected:**
- [x] Pink overlay appears while dragging
- [x] Screenshot captured successfully
- [x] Request sent to backend
- [x] Floating panel appears with:
  - [x] Cropped image of selection
  - [x] AI explanation text
  - [x] "Close & Reset" button
- [x] Can do up to 3 selections per page

#### Test 5: Error Handling

**Backend Offline:**
1. Stop backend server
2. Try to select something
3. Expected: Error alert with clear message about backend connection

**Invalid Backend URL:**
1. Open options
2. Set backend URL to `http://invalid.url:9999`
3. Save settings
4. Try to select something
5. Expected: Connection error with instructions to fix URL

**Small Selection:**
1. Hold Shift
2. Click (don't drag)
3. Expected: Nothing happens (selection too small)

#### Test 6: Settings Persistence
1. Set custom backend URL in options
2. Close browser completely
3. Reopen browser
4. Check options page
5. Expected: Custom URL is still saved

#### Test 7: Multiple Tabs
1. Open extension in tab A
2. Use the extension (select something)
3. Switch to tab B
4. Use the extension again
5. Expected: Both tabs work independently

## Testing in Firefox

### Installation
1. Open `about:debugging#/runtime/this-firefox`

2. **Switch to Firefox manifest:**
   ```bash
   cp manifest.json manifest.v3.json
   cp manifest.v2.json manifest.json
   ```

3. Click "Load Temporary Add-on"

4. Select `manifest.json` from the directory

5. Verify extension loads

### Run Same Test Cases
- Follow all test cases from Chrome/Edge/Brave section
- Note: In Firefox, the extension is removed when browser closes

### Restore Chromium Manifest
```bash
cp manifest.v3.json manifest.json
```

## Testing Checklist Summary

### Installation
- [ ] Chrome - loads without errors
- [ ] Edge - loads without errors
- [ ] Brave - loads without errors
- [ ] Firefox - loads without errors

### Popup
- [ ] Popup opens correctly
- [ ] Backend URL displayed
- [ ] All buttons work

### Options
- [ ] Options page accessible
- [ ] Can change backend URL
- [ ] Settings persist

### Core Features
- [ ] Shift+drag selection works
- [ ] Screenshot captured
- [ ] Backend processes request
- [ ] Explanation displayed
- [ ] 3-question limit enforced

### Error Handling
- [ ] Backend offline - clear error
- [ ] Invalid URL - helpful message
- [ ] Small selection - ignored

### Cross-Browser
- [ ] Works identically in all browsers
- [ ] No browser-specific bugs
- [ ] Icons display correctly everywhere

## Performance Testing

### Metrics to Check
- Extension load time: < 1 second
- Screenshot capture: < 500ms
- Backend response: < 5 seconds (depends on AI model)
- Memory usage: < 50MB

### How to Check
1. Open browser DevTools
2. Go to Performance or Memory tab
3. Record while using extension
4. Review metrics

## Regression Testing

When making changes, re-test:
1. Core selection functionality
2. Settings persistence
3. Error messages
4. All browser compatibility

## Common Issues

### Issue: Extension won't load
**Solution:** Check for manifest syntax errors: `python3 -m json.tool manifest.json`

### Issue: Screenshot fails
**Solution:** Check permissions in browser - extension needs "activeTab"

### Issue: Backend connection fails
**Solution:** 
- Verify backend is running: `curl http://localhost:8000`
- Check console for CORS errors
- Verify backend URL in options

### Issue: Icons not showing
**Solution:** Check icons directory exists with all 3 PNG files

### Issue: Settings not saving
**Solution:** Check "storage" permission in manifest

## Automated Testing (Future)

For production, consider adding:
- Selenium WebDriver tests
- Jest for JavaScript unit tests
- Integration tests for backend communication
- Screenshot comparison tests

## Reporting Bugs

When reporting bugs, include:
1. Browser name and version
2. Extension version (1.0.0)
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (F12 → Console)
6. Screenshots if UI issue

## Sign-Off

After completing all tests:
- [ ] All test cases passed
- [ ] No console errors
- [ ] Works in all target browsers
- [ ] Ready for production/submission

Tester: _______________
Date: _______________
Browsers tested: _______________
