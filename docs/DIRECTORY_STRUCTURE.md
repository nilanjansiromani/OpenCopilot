# 📁 OpenCopilot - Directory Structure

Clean, organized, and professional file structure.

## 🗂️ Overview

```
highlightr/
├── 📄 Core Extension Files (Root)
├── 📦 assets/          (Icons, Fonts, Libraries)
└── 📚 docs/            (Documentation)
```

---

## 📂 Complete Structure

```
highlightr/
│
├── README.md                    # Main documentation
├── manifest.json                # Extension configuration
├── .gitignore                   # Git ignore rules
│
├── 🔧 Service Worker & Scripts
│   ├── background.js            # Service worker (keyboard shortcuts)
│   ├── content.js               # Page injection & iframe management
│   ├── aiService.js             # AI integrations (Groq, Gemini, Ollama, OpenRouter)
│   └── htmlToMarkdown.js        # HTML → Markdown converter
│
├── 📱 Sidebar Interface
│   ├── sidebar.html             # Sidebar UI
│   ├── sidebar.js               # Sidebar logic
│   └── sidebar.css              # Sidebar styling
│
├── 🖥️ Modal Interface
│   ├── modal.html               # Modal UI
│   └── modal.css                # Modal styling
│
├── ⚙️ Settings Page
│   ├── settings.html            # Settings UI
│   ├── settings.js              # Settings logic
│   └── settings.css             # Settings styling
│
├── 📦 assets/
│   │
│   ├── 🎨 icons/
│   │   ├── icon16.png           # 16x16 icon
│   │   ├── icon48.png           # 48x48 icon
│   │   └── icon128.png          # 128x128 icon
│   │
│   ├── 🔤 fonts/
│   │   ├── lato.css             # Font definitions
│   │   ├── lato-light.woff2     # Lato Light (300)
│   │   ├── lato-regular.woff2   # Lato Regular (400)
│   │   ├── lato-bold.woff2      # Lato Bold (700)
│   │   └── lato-black.woff2     # Lato Black (900)
│   │
│   └── 📚 libs/
│       ├── marked.min.js        # Markdown parser (34KB)
│       └── mermaid.min.js       # Diagram renderer (2.8MB)
│
└── 📚 docs/
    ├── README.md                # Detailed documentation
    ├── QUICKSTART.md            # 5-minute setup guide
    ├── INSTALLATION.md          # Installation instructions
    ├── FEATURES.md              # Feature breakdown
    ├── FEATURES_SUMMARY.md      # Complete features list
    ├── CHANGELOG.md             # Version history
    ├── SIMPLIFIED.md            # No-build-process explanation
    ├── CSP_COMPLIANCE.md        # Security compliance
    ├── CSP_FIX.md               # CSP fixes implemented
    ├── DARK_MODE_UPDATE.md      # Dark mode details
    ├── SLACK_STYLE_UPDATE.md    # Slack UI details
    ├── OPENCOP ILOT_UPDATE.md   # Rebranding details
    ├── MINDMAP_FEATURE.md       # Mindmap feature docs
    ├── UPDATE_SUMMARY.md        # Update summaries
    └── DIRECTORY_STRUCTURE.md   # This file
```

---

## 📊 File Count

| Category | Count | Size |
|----------|-------|------|
| Core Extension Files | 9 files | ~50KB |
| UI Files (HTML/CSS) | 6 files | ~30KB |
| Assets | 10 files | ~3.1MB |
| Documentation | 14 files | ~100KB |
| **Total** | **39 files** | **~3.2MB** |

---

## 🎯 File Organization Logic

### Root Directory
**Purpose:** Core extension files that Chrome loads directly

**Contains:**
- Extension manifest
- Service worker (background.js)
- Content scripts (content.js)
- UI files (HTML, CSS, JS)
- Core utilities (aiService, htmlToMarkdown)

### assets/
**Purpose:** Static resources organized by type

**Subfolders:**
- `icons/` - Extension icons (16, 48, 128px)
- `fonts/` - Lato font family (4 weights)
- `libs/` - Third-party libraries (marked.js, mermaid.js)

### docs/
**Purpose:** All documentation and guides

**Contains:**
- User guides (README, QUICKSTART, INSTALLATION)
- Feature documentation (FEATURES, FEATURES_SUMMARY)
- Technical docs (CSP_COMPLIANCE, CHANGELOG)
- Update notes (various UPDATE docs)

---

## 🔍 Quick Reference

### Load Extension
```bash
chrome://extensions/
→ Developer mode ON
→ Load unpacked
→ Select: /path/to/highlightr/
```

### Find Files

**Need to edit AI logic?**  
→ `aiService.js`

**Need to change UI?**  
→ `sidebar.html`, `sidebar.css`, `sidebar.js`

**Need to update settings?**  
→ `settings.html`, `settings.js`

**Need documentation?**  
→ `docs/` folder

**Need icons?**  
→ `assets/icons/`

---

## 📝 Benefits of This Structure

### ✅ Clean
- Root has only essential extension files
- Assets organized by type
- Documentation separate

### ✅ Professional
- Standard folder structure
- Easy to navigate
- Clear organization

### ✅ Maintainable
- Files easy to find
- Logical grouping
- Scalable structure

### ✅ User-Friendly
- README in root
- Docs in dedicated folder
- Clear naming

---

## 🚀 Loading in Chrome

Chrome loads from **root directory**:
- Reads `manifest.json`
- Loads files referenced in manifest
- Accesses `assets/` via web_accessible_resources
- Everything works seamlessly!

**No build process needed** - Just point Chrome to the root folder!

---

## 📦 Size Breakdown

```
Extension core:    ~50KB
UI & styling:      ~30KB
Icons:             ~650 bytes
Fonts (Lato):      ~60KB
Libraries:         ~3MB
Documentation:     ~100KB
─────────────────────────
Total:             ~3.2MB
```

**Note:** Most size is from Mermaid.js (2.8MB) for diagram rendering

---

## 🎯 Clean & Organized!

The directory is now professionally structured:
- ✅ Core files in root
- ✅ Assets organized by type
- ✅ Documentation in docs/
- ✅ Easy to navigate
- ✅ Ready for Chrome!

---

**Status: 📁 Fully Organized!**

