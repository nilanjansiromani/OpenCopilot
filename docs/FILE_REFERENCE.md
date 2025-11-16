# 📖 File Reference Guide

Quick reference for all files in OpenCopilot.

## 🔧 Core Extension Files (Root)

### manifest.json
**Purpose:** Chrome extension configuration  
**Contains:** Permissions, commands, icons, web resources  
**Edit when:** Adding new features, changing permissions

### background.js
**Purpose:** Service worker (runs in background)  
**Contains:** Keyboard shortcut handlers, installation logic  
**Edit when:** Adding shortcuts, changing background behavior

### content.js
**Purpose:** Injected into web pages  
**Contains:** Sidebar/modal injection, page content extraction  
**Edit when:** Changing how content is extracted, iframe management

### aiService.js
**Purpose:** AI service integrations  
**Contains:** Groq, Gemini, Ollama, OpenRouter API calls  
**Edit when:** Adding new AI services, changing API behavior

### htmlToMarkdown.js
**Purpose:** Convert HTML to Markdown  
**Contains:** Simple HTML parser and converter  
**Edit when:** Improving content extraction

## 📱 Sidebar Files

### sidebar.html
**Purpose:** Sidebar UI structure  
**Contains:** Header, messages, input, quick actions  
**Edit when:** Adding UI elements

### sidebar.js
**Purpose:** Sidebar logic  
**Contains:** Message handling, AI calls, history, Mermaid rendering  
**Edit when:** Adding features, changing behavior

### sidebar.css
**Purpose:** Sidebar styling  
**Contains:** Dark theme, Slack-style messages, animations  
**Edit when:** Changing appearance

## 🖥️ Modal Files

### modal.html
**Purpose:** Modal (centered view) UI  
**Contains:** Same as sidebar.html  
**Edit when:** Adding modal-specific UI

### modal.css
**Purpose:** Modal positioning and backdrop  
**Contains:** Centered layout, overlay styling  
**Edit when:** Changing modal appearance

## ⚙️ Settings Files

### settings.html
**Purpose:** Settings page UI  
**Contains:** Service selection, API key inputs  
**Edit when:** Adding new services, fields

### settings.js
**Purpose:** Settings logic  
**Contains:** Save/load settings, form handling  
**Edit when:** Adding settings functionality

### settings.css
**Purpose:** Settings page styling  
**Contains:** Card layout, form styles, blue theme  
**Edit when:** Changing settings appearance

## 📦 Assets

### assets/icons/
- `icon16.png` - Toolbar icon (16x16)
- `icon48.png` - Extension page icon (48x48)
- `icon128.png` - Chrome store icon (128x128)

### assets/fonts/
- `lato.css` - Font face definitions
- `lato-light.woff2` - Lato 300
- `lato-regular.woff2` - Lato 400
- `lato-bold.woff2` - Lato 700
- `lato-black.woff2` - Lato 900

### assets/libs/
- `marked.min.js` - Markdown parser (34KB)
- `mermaid.min.js` - Diagram renderer (2.8MB)

## 📚 Documentation (docs/)

### User Guides
- `README.md` - Comprehensive guide
- `QUICKSTART.md` - 5-minute setup
- `INSTALLATION.md` - Detailed installation

### Feature Docs
- `FEATURES.md` - Feature overview
- `FEATURES_SUMMARY.md` - Complete list
- `MINDMAP_FEATURE.md` - Mindmap details

### Technical Docs
- `CSP_COMPLIANCE.md` - Security compliance
- `CSP_FIX.md` - CSP fixes applied
- `SIMPLIFIED.md` - No-build explanation
- `DIRECTORY_STRUCTURE.md` - This guide

### Update Notes
- `CHANGELOG.md` - Version history
- `DARK_MODE_UPDATE.md` - Dark theme details
- `SLACK_STYLE_UPDATE.md` - UI updates
- `OPENCOP ILOT_UPDATE.md` - Rebranding
- `UPDATE_SUMMARY.md` - Update summary

---

## 🔗 File Dependencies

### Sidebar/Modal Loading Chain
```
sidebar.html
  ├── sidebar.css
  │   └── assets/fonts/lato.css
  │       └── assets/fonts/*.woff2
  ├── htmlToMarkdown.js
  ├── assets/libs/marked.min.js
  ├── assets/libs/mermaid.min.js
  ├── aiService.js
  └── sidebar.js
```

### Extension Loading Chain
```
manifest.json
  ├── background.js
  ├── content.js
  ├── settings.html
  │   ├── settings.css
  │   └── settings.js
  └── assets/icons/*.png
```

---

## 🎯 Common Tasks

### Adding a New AI Service
1. Edit `aiService.js` - Add new method
2. Edit `settings.html` - Add service option
3. Edit `settings.js` - Add configuration logic
4. Edit `sidebar.js` - Update service icons/names

### Changing UI Colors
1. Edit `sidebar.css` - Change color variables
2. Edit `modal.css` - Update modal colors
3. Edit `settings.css` - Update settings colors

### Adding Quick Action
1. Edit `sidebar.html` - Add button to quick-prompts
2. Edit `modal.html` - Add same button
3. Edit `sidebar.js` - Add to quickPromptTemplates

### Updating Documentation
1. Edit existing file in `docs/`
2. Or create new file in `docs/`
3. Update `README.md` if needed

---

## 📏 File Sizes

```
Core JS files:      ~30KB total
UI files:           ~20KB total
Icons:              ~650 bytes
Fonts:              ~60KB
marked.js:          34KB
mermaid.js:         2.8MB
Documentation:      ~100KB
```

---

## ✨ Organization Benefits

1. **Clean Root** - Only essential extension files
2. **Easy Navigation** - Everything has its place
3. **Professional** - Industry-standard structure
4. **Scalable** - Easy to add new features
5. **Maintainable** - Quick to find files

---

**Quick Access:**
- Extension files: Root directory
- Icons: `assets/icons/`
- Fonts: `assets/fonts/`
- Libraries: `assets/libs/`
- Docs: `docs/`

