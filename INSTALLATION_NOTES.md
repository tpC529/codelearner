# Installation Notes

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
