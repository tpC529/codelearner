# Privacy Policy

**Last Updated: December 12, 2025**

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

### Local Processing Only

All code analysis and explanations are performed **entirely on your local machine** using Ollama, an open-source AI tool that runs locally. When you use CodeLearner:

1. You select a code snippet or UI element on a webpage
2. A screenshot of that selection is captured
3. The screenshot is sent **only** to your local backend server (running at `127.0.0.1:8000` on your own computer)
4. The local Ollama AI model processes the image and generates an explanation
5. The explanation is displayed in your browser

**At no point does any data leave your device or get sent to external servers.**

### Screenshot Handling

When you select code or UI elements:

- Screenshots are captured temporarily in memory
- Screenshots are sent only to your local backend (127.0.0.1)
- Screenshots are never uploaded to external servers
- Screenshots are not permanently stored by the extension

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
- **Purpose**: Stores your backend URL preference locally in your browser
- **Usage**: Saves your preferred backend server URL (default: http://127.0.0.1:8000)
- **Data Stored**: Only the backend URL setting, stored locally in your browser

**Important**: These permissions allow the extension to access webpage content, but all processing happens locally and no data is transmitted externally.

## Backend Server

The CodeLearner extension requires a backend server to function, which you run on your own computer:

- The backend runs locally at `127.0.0.1:8000` (your machine only)
- The backend uses Ollama AI models installed on your machine
- No cloud services or external APIs are involved
- You have complete control over the backend and its data

## Third-Party Services

CodeLearner does NOT use any third-party services:

- No analytics tools (e.g., Google Analytics)
- No crash reporting services
- No advertising networks
- No external APIs
- No cloud services

The only "service" involved is Ollama, which runs entirely on your local machine.

## Data Storage

The extension stores only one piece of information locally:

- **Backend URL**: Your preferred backend server URL (stored using Chrome/Firefox storage API)

This setting is stored locally in your browser and is never transmitted to external servers.

## Security

CodeLearner implements several security measures:

- **Content Security Policy (CSP)**: Prevents unauthorized script execution
- **XSS Protection**: All content is sanitized before display
- **Local-Only Processing**: No external network requests except to your local backend
- **Minimal Permissions**: Only requests necessary browser permissions

## Children's Privacy

CodeLearner does not knowingly collect any information from anyone, including children under the age of 13.

## Changes to This Privacy Policy

We may update this privacy policy from time to time to reflect changes in the extension or legal requirements. When we make changes:

- The "Last Updated" date at the top will be revised
- Significant changes will be announced in the GitHub repository
- Users will be notified through extension updates when appropriate

We encourage you to review this privacy policy periodically.

## Contact Us

If you have questions or concerns about this privacy policy or the CodeLearner extension, please:

- Open an issue on our [GitHub repository](https://github.com/tpC529/codelearner)
- Review our documentation at [https://github.com/tpC529/codelearner](https://github.com/tpC529/codelearner)

## Your Rights

Since we do not collect any personal data, there is no personal information to access, modify, or delete. You maintain complete control over:

- The extension installation (you can uninstall at any time)
- Your local backend server and its data
- Any local storage used by the extension (can be cleared through browser settings)

## Compliance

This privacy policy is designed to comply with:

- Chrome Web Store Developer Program Policies
- Firefox Add-ons Policies
- Microsoft Edge Add-ons Policies
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

Since CodeLearner does not collect any user data, it inherently complies with most privacy regulations.

## Open Source

CodeLearner is open source software. You can review the complete source code, including how data is handled, at:

[https://github.com/tpC529/codelearner](https://github.com/tpC529/codelearner)

Transparency is important to us, and we encourage users to review the code to verify our privacy practices.
