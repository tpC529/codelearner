# Extension Icons

This directory contains the LearnByHover extension icons in multiple sizes.

## Files

- `icon16.png` - 16x16 pixels - Used in browser toolbar
- `icon48.png` - 48x48 pixels - Used in extension management pages
- `icon128.png` - 128x128 pixels - Used in store listings and installation prompts

## Design

- **Color**: Pink/Magenta (#FF006E) - Matches extension branding
- **Symbol**: Code brackets `< >` with forward slashes
- **Style**: Simple, modern, recognizable at small sizes

## Regenerating Icons

If you need to regenerate the icons:

```bash
python3 create_icons.py
```

This will create new PNG files in this directory.

## Requirements

All three sizes are required for proper extension functionality across all browsers.
