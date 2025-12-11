#!/bin/bash
# Script to package the LearnByHover extension for distribution

set -e

# Get version from manifest.json
VERSION=$(python3 -c "import json; print(json.load(open('manifest.json'))['version'])")
PACKAGE_NAME="learnbyhover-v${VERSION}.zip"

echo "📦 Packaging LearnByHover Extension v${VERSION}"
echo ""

# Remove old package if exists
if [ -f "$PACKAGE_NAME" ]; then
    echo "🗑️  Removing old package: $PACKAGE_NAME"
    rm "$PACKAGE_NAME"
fi

# Create the package
echo "📝 Creating package..."
zip -r "$PACKAGE_NAME" \
    manifest.json \
    background.js \
    content.js \
    popup.html \
    icons/ \
    README.md \
    -x "*.git*" \
    -x "*__pycache__*" \
    -x "*.pyc" \
    -x "*.DS_Store" \
    -x "test.html" \
    -x "backend.py" \
    -x "serve_test.py"

echo ""
echo "✅ Package created successfully!"
echo "📦 File: $PACKAGE_NAME"
echo "📊 Size: $(du -h "$PACKAGE_NAME" | cut -f1)"
echo ""
echo "Next steps:"
echo "1. Test the extension by loading it in developer mode"
echo "2. Review DISTRIBUTION.md for store submission guidelines"
echo "3. Upload $PACKAGE_NAME to browser stores"
