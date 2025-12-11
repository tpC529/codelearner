# Distribution Guide

This guide explains how to package and distribute the LearnByHover extension to various browser stores.

## Preparing for Distribution

### 1. Testing Checklist

Before submitting to any store, ensure:
- [ ] Extension loads without errors in all target browsers
- [ ] All permissions are justified and necessary
- [ ] Icons display correctly in all sizes
- [ ] Popup UI is functional and responsive
- [ ] Content script works on various websites
- [ ] Backend connectivity is documented
- [ ] Privacy policy is clear about data handling

### 2. Create a ZIP Package

```bash
# From the repository root
zip -r learnbyhover-v1.0.0.zip \
  manifest.json \
  background.js \
  content.js \
  popup.html \
  icons/ \
  README.md \
  -x "*.git*" -x "*__pycache__*" -x "*.pyc" -x "backend.py" -x "serve_test.py" -x "test.html"
```

**Note:** The backend.py file is NOT included in the extension package as it runs separately.

## Browser Store Submission

### Chrome Web Store

**Requirements:**
- Developer account ($5 one-time fee)
- Detailed privacy policy (if collecting data)
- Screenshots and promotional images
- Accurate description

**Steps:**
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Click "New Item"
3. Upload the ZIP file
4. Fill in store listing details:
   - Name: LearnByHover
   - Summary: AI-powered code explanations for any webpage
   - Description: [Use enhanced README content]
   - Category: Developer Tools
   - Language: English
5. Upload screenshots (1280x800 or 640x400)
6. Upload promotional tile (440x280) - optional but recommended
7. Set pricing to Free
8. Select regions for distribution
9. Submit for review

**Review Time:** Usually 1-3 business days

### Microsoft Edge Add-ons

**Requirements:**
- Microsoft Partner Center account (free)
- Privacy policy URL
- Screenshots

**Steps:**
1. Go to [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/)
2. Click "New Extension"
3. Upload the same ZIP file (Chrome extensions are compatible)
4. Fill in store listing similar to Chrome
5. Submit for review

**Review Time:** Usually 1-3 business days

### Firefox Add-ons (AMO)

**Requirements:**
- Firefox account (free)
- Detailed privacy policy
- Source code if using minification/obfuscation (we don't)

**Steps:**
1. Go to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
2. Click "Submit a New Add-on"
3. Upload the ZIP file
4. Choose distribution channel:
   - **On this site** (recommended): Listed on AMO, auto-updates
   - **On your own**: Self-hosted, manual updates
5. Fill in listing details
6. Submit for review

**Review Time:** Usually 1-5 business days (manual review)

**Note:** Firefox has stricter review policies and may request changes.

### Opera Add-ons

**Requirements:**
- Opera account (free)
- Chrome/Chromium extension package

**Steps:**
1. Go to [Opera Add-ons Developer Portal](https://addons.opera.com/developer/)
2. Upload the same ZIP file
3. Fill in listing information
4. Submit for review

**Review Time:** Usually 2-7 business days

## Store Listing Assets

### Required Images

Create these promotional images for better store presence:

#### Screenshots (Required)
- Size: 1280x800px or 640x400px
- Show the extension in action
- Recommended: 3-5 screenshots
- Ideas:
  1. Extension popup with instructions
  2. Selection overlay on code
  3. Explanation panel showing results
  4. Different websites demonstrating versatility

#### Promotional Tile (Chrome - Optional but recommended)
- Size: 440x280px
- Marquee/banner style image
- Includes extension name and tagline

#### Icon Files (Already Created)
- 16x16px - Toolbar icon
- 48x48px - Extension management page
- 128x128px - Chrome Web Store and installation

### Description Template

```
LearnByHover - AI Code Explanations

Learn about any code or UI element instantly!

🎯 HOW IT WORKS
Simply hold Shift and drag over any code snippet or UI element on any webpage. LearnByHover captures your selection and explains it using advanced AI vision models.

✨ FEATURES
• Instant code explanations powered by local AI
• Works on any website
• Privacy-focused - your data stays on your machine
• Lightweight and fast
• No account required
• Free and open source

🔒 PRIVACY & SECURITY
LearnByHover uses a local AI model (Ollama) running on your machine. No code or screenshots are sent to external servers. All processing happens locally, ensuring your privacy.

📋 SETUP REQUIRED
This extension requires a local backend server:
1. Install Ollama from ollama.ai
2. Run: ollama pull moondream:1.8b
3. Start the backend server (see GitHub for instructions)

🛠️ PERFECT FOR
• Developers learning new codebases
• Students studying programming
• Code reviewers
• Anyone curious about how UI elements work

💻 OPEN SOURCE
View the code, contribute, or report issues on GitHub:
https://github.com/tpC529/codelearner

SUPPORT
For setup help or issues, visit our GitHub repository.
```

## Privacy Policy

Required for most stores. Create a privacy policy page that includes:

1. **What data we collect**: None (all local processing)
2. **How we use data**: Screenshots are processed locally and discarded
3. **Third-party services**: None
4. **User rights**: Full control over data
5. **Contact information**: GitHub issues page

Example minimal privacy policy:

```
Privacy Policy for LearnByHover

Last Updated: [Date]

LearnByHover is committed to protecting your privacy.

Data Collection:
We do not collect, store, or transmit any personal data or browsing information.

Local Processing:
All screenshot and code analysis happens locally on your machine using Ollama.
No data is sent to external servers.

Permissions:
- activeTab: Required to capture screenshots of the current tab
- <all_urls>: Required to inject the selection interface on any webpage

Contact:
For questions, open an issue at https://github.com/tpC529/codelearner
```

## Post-Submission

### After Approval

1. **Monitor Reviews**: Respond to user feedback
2. **Track Issues**: Monitor GitHub issues for bug reports
3. **Plan Updates**: Regular updates show active maintenance
4. **Analytics**: Use store-provided analytics to understand usage

### Updating the Extension

When releasing updates:

1. Update version in `manifest.json` (follow semver: 1.0.0 → 1.0.1 for patches)
2. Create a new ZIP package
3. Upload to each store's developer dashboard
4. Provide changelog notes
5. Wait for re-review (usually faster than initial review)

## Alternative: Self-Distribution

If you prefer not to submit to stores, users can:

1. **Developer Mode Installation** (documented in README.md)
2. **GitHub Releases**: Create release with ZIP file
3. **Direct Distribution**: Share ZIP for manual installation

Note: Self-distributed extensions will show warnings in browsers and won't auto-update.

## Troubleshooting Common Rejection Reasons

### Chrome Web Store
- **Missing privacy policy**: Add a clear policy for host_permissions
- **Unclear permission usage**: Explain why each permission is needed
- **Misleading functionality**: Ensure description matches actual features

### Firefox AMO
- **Unnecessary permissions**: Firefox is strict about permissions
- **Missing source code**: Required if code is minified (we don't minify)
- **Trademark issues**: Ensure no conflicts with existing extensions

### Edge Add-ons
- Usually accepts Chrome-compatible extensions easily
- May request clarification on permissions

## Additional Resources

- [Chrome Extension Publishing Guide](https://developer.chrome.com/docs/webstore/publish/)
- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [Edge Extensions Publishing](https://docs.microsoft.com/microsoft-edge/extensions-chromium/publish/)
- [Opera Extensions Publishing](https://dev.opera.com/extensions/)
