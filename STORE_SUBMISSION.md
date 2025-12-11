# Store Submission Guide

This guide helps you prepare and submit the LearnByHover extension to various browser web stores.

## Prerequisites

Before submitting to any store, ensure:
- [ ] All code is tested and working
- [ ] Icons are properly generated (16x16, 48x48, 128x128)
- [ ] README.md is complete and accurate
- [ ] Privacy policy is prepared (if collecting any data)
- [ ] Screenshots are ready for store listings

## Chrome Web Store

### Requirements
- Developer account ($5 one-time fee)
- Privacy policy (if using permissions like storage, tabs)
- Screenshots (1280x800 or 640x400)
- Promotional images (optional but recommended)

### Submission Steps

1. **Create Developer Account**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay the $5 registration fee

2. **Prepare Package**
   - Ensure manifest.json uses Manifest V3
   - Remove development files (create_icons.py, serve_test.py, test.html)
   - Zip the extension directory

3. **Upload and Fill Details**
   - Upload the ZIP file
   - Fill in store listing details:
     - Name: LearnByHover
     - Summary: Hold Shift + drag to ask about any code/UI element
     - Description: (Use README content)
     - Category: Developer Tools
     - Language: English
   - Add screenshots
   - Set pricing (Free)

4. **Privacy Practices**
   - Justify all permissions used
   - Provide privacy policy if needed

5. **Submit for Review**
   - Review can take 1-3 days

## Microsoft Edge Add-ons

### Requirements
- Microsoft Partner Center account (Free)
- Same assets as Chrome (Edge uses Chromium)

### Submission Steps

1. **Create Partner Account**
   - Go to [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/microsoftedge)
   - Register for free

2. **Prepare Package**
   - Use the same ZIP as Chrome (Manifest V3)
   - Edge is Chromium-based, so compatibility is excellent

3. **Submit**
   - Upload ZIP
   - Fill in similar details as Chrome
   - Submit for review (usually faster than Chrome)

## Firefox Add-ons

### Requirements
- Mozilla Add-on Developer account (Free)
- Different manifest version (use manifest.v2.json)

### Submission Steps

1. **Create Developer Account**
   - Go to [Mozilla Add-ons Developer Hub](https://addons.mozilla.org/developers)
   - Sign in with Firefox Account

2. **Prepare Firefox Package**
   ```bash
   # Backup Chrome manifest
   cp manifest.json manifest.v3.json
   
   # Use Firefox manifest
   cp manifest.v2.json manifest.json
   
   # Remove development files
   rm create_icons.py serve_test.py test.html
   
   # Create ZIP
   zip -r learnbyhover-firefox.zip . -x "*.git*" "*.DS_Store" "*manifest.v3.json"
   
   # Restore Chrome manifest
   cp manifest.v3.json manifest.json
   ```

3. **Upload and Submit**
   - Upload the Firefox ZIP
   - Fill in metadata
   - Source code review required - be prepared to explain backend requirement
   - Review can take 1-2 weeks

4. **Important Notes**
   - Firefox requires source code review
   - Must explain external backend dependency
   - Consider making backend optional for approval

## Opera Add-ons

Opera uses Chromium, so the Chrome extension works directly:

1. Go to [Opera Add-ons Developer Portal](https://addons.opera.com/developer)
2. Upload the Chrome/Edge package
3. Fill in details
4. Submit for review

## Brave Browser

Brave uses Chrome extensions directly:
- Users can install from Chrome Web Store
- No separate submission needed

## Common Requirements

### Privacy Policy
Create a privacy policy if you:
- Store user data
- Access user browsing data
- Use analytics

Template:
```
Privacy Policy for LearnByHover

Data Collection: This extension does not collect, store, or transmit any personal data.

Permissions Used:
- activeTab: Required to capture screenshots of the current tab
- tabs: Required for tab management
- storage: Used to store user preferences (backend URL) locally
- <all_urls>: Required to work on all websites

External Services: The extension communicates with a user-configured backend server 
for AI processing. No data is sent to third-party services.

Data Storage: Only the backend URL preference is stored locally on your device.

Contact: [Your email or GitHub]
```

### Screenshots

Recommended sizes:
- 1280x800 (desktop)
- 640x400 (smaller displays)

Capture:
1. Extension working on a code snippet
2. Options page showing settings
3. Popup showing instructions
4. Result panel with AI explanation

### Promotional Assets

Optional but recommended:
- Small tile: 440x280
- Large tile: 920x680
- Marquee: 1400x560

## Post-Submission

### Version Updates
1. Update version in manifest.json (e.g., 1.0.0 → 1.0.1)
2. Create new package
3. Upload to stores
4. Add changelog notes

### User Support
- Monitor store reviews
- Respond to user questions
- Fix reported bugs promptly
- Update README with FAQs

## Marketing

### Store Optimization
- Use keywords: code, learning, AI, developer, explanation
- Good description with benefits
- Quality screenshots
- Respond to reviews

### Promotion
- Post on Reddit (r/webdev, r/programming)
- Share on Twitter/X
- Create demo video
- Write blog post

## Compliance

### GDPR/Privacy
- No personal data collection = minimal compliance
- If adding analytics later, update privacy policy
- Get consent for any tracking

### Terms of Service
- Clarify backend requirement
- No warranty on AI explanations
- User responsible for backend setup

## Support Resources

- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Edge Add-ons Policies](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/store-policies/developer-policies)
- [Firefox Add-on Policies](https://extensionworkshop.com/documentation/publish/add-on-policies/)
