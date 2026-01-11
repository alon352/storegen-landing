# StoreGen Pro Landing Page

A modular, AI-agent-friendly landing page for StoreGen Pro WooCommerce plugin.

## Project Structure

```
storegen-landing/
├── index.html              # Main HTML (clean, semantic)
├── README.md               # This file
├── assets/
│   ├── css/
│   │   └── main.css        # All styles (~600 lines)
│   ├── js/
│   │   └── app.js          # All JavaScript (~280 lines)
│   ├── lang/
│   │   ├── en.json         # English translations
│   │   ├── he.json         # Hebrew translations (RTL)
│   │   ├── es.json         # Spanish translations
│   │   └── fr.json         # French translations
│   └── images/
│       └── logo.svg        # Brand logo (add your own)
```

## File Responsibilities

| File | Purpose | Edit When... |
|------|---------|--------------|
| `index.html` | Page structure, sections, layout | Adding/removing sections, changing structure |
| `main.css` | All visual styling | Changing colors, spacing, animations, responsive |
| `app.js` | Interactivity & logic | Fixing bugs, adding features, changing behavior |
| `*.json` | Translation strings | Updating copy, adding languages |

## Key Concepts

### Internationalization (i18n)

All text uses `data-i18n` attributes:
```html
<h2 data-i18n="feat_title">Pro Features</h2>
```

Translations are stored in JSON files:
```json
{
  "feat_title": "Pro Features"
}
```

To add a new language:
1. Copy `en.json` to `xx.json`
2. Translate all values
3. Add button in HTML: `<button class="lang-opt" data-lang="xx">Language</button>`

### CSS Scoping

All styles are scoped to `#sg-wp-container` for WordPress compatibility:
```css
#sg-wp-container .v-hero { ... }
```

### Theme System

Dark/light themes use CSS variables:
```css
#sg-wp-container {
  --bg: #03040a;        /* Dark mode */
  --text: #f1f5f9;
}

body[data-theme="light"] #sg-wp-container {
  --bg: #f8fafc;        /* Light mode */
  --text: #0f172a;
}
```

## Quick Edits Guide

### Change Colors
Edit CSS variables in `main.css` (lines 25-45):
- `--accent` - Primary brand color
- `--bg` - Background color
- `--text` - Text color

### Update Copy
Edit the appropriate language file in `assets/lang/`

### Add a Section
1. Add HTML structure in `index.html`
2. Use existing CSS classes (`.v-section`, `.v-head`, `.v-grid`, `.v-card`)
3. Add `data-i18n` attributes for translatable text
4. Add translation keys to all language files

### Change Animations
Edit keyframe animations in `main.css`:
- `sgBgFlow` - Background gradient animation
- `floatUp` - Spark particle animation
- `flowGrad` - Gradient text animation

## Development

### Local Testing
Simply open `index.html` in a browser. No build step required.

**Note:** Due to fetch() for language files, you may need a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

### WordPress Integration
The `#sg-wp-container` wrapper ensures styles don't leak into WordPress themes.

## Dependencies

- **Google Fonts**: Outfit (LTR) + Rubik (RTL)
- No JavaScript libraries required

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Reduced motion is respected via `prefers-reduced-motion` media query.
