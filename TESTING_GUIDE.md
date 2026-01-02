# Testing Guide for CodeLearner v2.0

This guide explains how to test the browser-based inference implementation.

## Prerequisites

- A modern web browser (Chrome 113+, Firefox 118+, Edge 113+, Safari 16+, Brave 1.52+)
- The extension loaded in developer mode
- Internet connection (for first use only)
- At least 500MB free disk space
- At least 2GB RAM available

## Test Cases

### 1. Extension Installation

**Steps:**
1. Load the extension in your browser
2. Open browser console (F12)
3. Check for any errors

**Expected Result:**
- Extension loads without errors
- Extension icon appears in toolbar
- No console errors

### 2. First Use - Model Download

**Steps:**
1. Open test.html in your browser
2. Hold Shift + drag over a code block
3. Observe the loading panel

**Expected Result:**
- Loading panel appears with "Initializing AI model..." message
- Progress messages appear (downloading, processing)
- Model downloads (~350MB, may take 30-60 seconds)
- After download, explanation appears in floating panel
- No errors in console

**Note:** This test requires internet connection and may take time depending on your connection speed.

### 3. Subsequent Uses - Cached Model

**Steps:**
1. Reload test.html
2. Hold Shift + drag over a code block
3. Observe response time

**Expected Result:**
- Model loads from cache (< 2 seconds)
- Processing completes in 2-4 seconds
- Explanation appears in floating panel
- Much faster than first use

### 4. Browser-Based Inference (Default Mode)

**Steps:**
1. Ensure extension is in "Browser-Based" mode (default)
2. Open test.html
3. Hold Shift + drag over the button element
4. Wait for explanation

**Expected Result:**
- Captures screenshot successfully
- Sends to model worker for processing
- Returns explanation about the button
- Displays cropped image and explanation in panel

### 5. Backend Mode (Legacy)

**Prerequisites:**
- Python backend running on http://127.0.0.1:8000
- Ollama with moondream:1.8b model installed

**Steps:**
1. Start Python backend: `python backend.py`
2. Open extension options
3. Change "Inference Mode" to "Backend Mode"
4. Save settings
5. Open test.html
6. Hold Shift + drag over code

**Expected Result:**
- Extension uses backend instead of browser inference
- Sends request to http://127.0.0.1:8000/api
- Returns explanation from Ollama
- Works like v1.0

### 6. Settings Persistence

**Steps:**
1. Open extension options
2. Change inference mode
3. Change backend URL (if in backend mode)
4. Save settings
5. Close options
6. Reopen options

**Expected Result:**
- Settings are preserved
- Correct values displayed

### 7. Error Handling - No Internet (First Use)

**Steps:**
1. Clear browser cache to remove model
2. Disconnect from internet
3. Try to use extension

**Expected Result:**
- Error message about model download failure
- Graceful error handling
- User informed to check connection or enable backend mode

### 8. Error Handling - Backend Unavailable

**Steps:**
1. Switch to Backend Mode
2. Ensure Python backend is NOT running
3. Try to use extension

**Expected Result:**
- Fetch error caught
- Error message displayed to user
- Console shows error details

### 9. Multiple Selections

**Steps:**
1. Open test.html
2. Make 3 different selections (button, code, text)
3. Check question count

**Expected Result:**
- First 3 selections work
- After 3rd selection, shows "Limit reached" message
- Must reload page to reset

### 10. Cross-Browser Compatibility

**Steps:**
1. Test in Chrome
2. Test in Firefox
3. Test in Edge
4. Test in Safari (if on macOS)
5. Test in Brave

**Expected Result:**
- Works consistently across all browsers
- WebGL fallback works in Firefox/Safari (no WebGPU yet)
- No browser-specific errors

### 11. Memory Usage

**Steps:**
1. Open browser task manager
2. Load extension
3. Use extension 5 times
4. Check memory usage

**Expected Result:**
- Initial load: ~400-600MB for model
- Subsequent uses: Memory stays stable
- No memory leaks
- Memory released when tabs closed

### 12. Offline Mode

**Prerequisites:**
- Model already cached from previous use

**Steps:**
1. Use extension once to cache model
2. Disconnect from internet
3. Reload page
4. Use extension again

**Expected Result:**
- Works offline using cached model
- No network errors
- Same performance as online

## Performance Benchmarks

Record these metrics for comparison:

### Browser-Based Mode
- First use (with download): ___ seconds
- Model initialization: ___ seconds
- Inference time: ___ seconds
- Total time (cached): ___ seconds

### Backend Mode (for comparison)
- Inference time: ___ seconds
- Total time: ___ seconds

### Speedup Calculation
- Speedup = (Backend Time) / (Browser Cached Time)
- Expected: 1.5-2x faster

## Known Issues

Document any issues found during testing:

1. **Issue:** [Description]
   - **Severity:** High/Medium/Low
   - **Reproducible:** Yes/No
   - **Browser:** Chrome/Firefox/etc
   - **Workaround:** [If any]

## Test Environment

Record your test environment:

- **Browser:** [Name and version]
- **OS:** [Operating system]
- **GPU:** [Graphics card]
- **RAM:** [Amount of RAM]
- **Date:** [Test date]

## Security Testing

### XSS Protection
1. Try to inject HTML in explanation text
2. Verify content is sanitized
3. No script execution possible

### CSP Compliance
1. Check browser console for CSP violations
2. Verify WebAssembly loads correctly
3. No inline script errors

## Regression Testing

Ensure existing functionality still works:

- [ ] Screenshot capture
- [ ] Coordinate calculation
- [ ] Image cropping
- [ ] Panel display
- [ ] Close button
- [ ] Question count limit
- [ ] Page reload reset

## Documentation Verification

Verify documentation accuracy:

- [ ] README.md instructions work
- [ ] Installation steps correct
- [ ] Feature descriptions accurate
- [ ] Troubleshooting section helpful
- [ ] Privacy policy reflects actual behavior

## Cleanup

After testing:
1. Clear browser cache to remove test models
2. Reset extension settings
3. Uninstall test extension if desired

---

**Testing Status:** [ ] Not Started [ ] In Progress [ ] Complete

**Tester:** _______________

**Date:** _______________

**Overall Result:** [ ] Pass [ ] Fail [ ] Pass with Issues

**Notes:**
