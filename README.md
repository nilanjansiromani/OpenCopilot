# ⚡ OpenCopilot - AI Assistant for Chrome

A powerful, beautiful Chrome extension that brings AI co-pilot functionality to any web page. Analyze, summarize, and interact with web content using multiple AI services.

**✨ Pure Vanilla JavaScript - No build process required!**

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.1.0-blue?style=flat-square)

---

## 🚀 Quick Start

### Installation (30 seconds)

1. Open Chrome → `chrome://extensions/`
2. Enable **"Developer mode"** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `highlightr` folder
5. Done! ✨

### First Use

1. Click the OpenCopilot icon in Chrome toolbar
2. Configure your preferred AI service (Groq, Gemini, Ollama, or OpenRouter)
3. Press **`Cmd+Shift+H`** (or `Ctrl+Shift+H`) on any webpage
4. Start chatting with AI about the page!

---

## ✨ Key Features

### 🤖 Multi-AI Service Support
- **Groq** - Fast inference (Mixtral, Llama)
- **Gemini** - Google's powerful AI
- **Ollama** - Local AI (privacy-focused)
- **OpenRouter** - 100+ models (Claude, GPT-4, etc.)

### 🎨 Beautiful Dark UI
- Slack-style chat interface
- Background: `#051020`
- Lato font (14px)
- Smooth animations
- Professional design

### 💬 Two View Modes
- **Sidebar** (30vw) - Quick chat on the side
- **Modal** (80vw) - Full-screen reading mode
- Switch seamlessly with ⛶ button

### 🧠 Smart Features
- **Auto page analysis** - Extracts and converts HTML to Markdown
- **Conversation history** - Saves per URL, persists across restarts
- **Quick actions:**
  - ✨ Summarize
  - 📋 Bullet Points
  - 📚 New Terms
  - 🧠 **Mindmap** (visual diagrams!)

### 🎯 Advanced Features
- **Markdown rendering** - Beautiful formatted responses
- **Mermaid diagrams** - Interactive mindmaps and flowcharts
- **Inline settings** - Configure without leaving the page
- **Smart tables** - Auto-limited to 2 columns for readability

---

## 📁 Project Structure

```
highlightr/
├── manifest.json              # Extension configuration
├── background.js              # Service worker
├── content.js                 # Page content injection
├── sidebar.html/js/css        # Sidebar interface
├── modal.html/css             # Modal interface
├── settings.html/js/css       # Settings page
├── aiService.js               # AI integrations
├── htmlToMarkdown.js          # HTML converter
├── assets/
│   ├── icons/                 # Extension icons
│   ├── fonts/                 # Lato font files
│   └── libs/                  # marked.js, mermaid.js
└── docs/                      # Documentation
    ├── QUICKSTART.md
    ├── FEATURES.md
    ├── INSTALLATION.md
    └── ... more docs
```

---

## 🎯 Usage

### Opening OpenCopilot
Press **`Cmd+Shift+H`** (Mac) or **`Ctrl+Shift+H`** (Windows/Linux)

### Quick Actions
Click any pill for instant analysis:
- ✨ **Summarize** - Get page summary
- 📋 **Bullet Points** - Extract key points
- 📚 **New Terms** - Learn concepts
- 🧠 **Mindmap** - Visual diagram

### Switch Views
- Click **⛶** to switch from sidebar to modal
- Modal gives 80% screen width for better reading
- Messages persist between views

### Settings
- Click **⚙️** in header for quick settings
- Or click extension icon for full settings page
- Save and see confirmation message

---

## 🔧 Configuration

### Groq (Recommended)
1. Get API key from [console.groq.com](https://console.groq.com/keys)
2. Model: `mixtral-8x7b-32768` (or any Groq model)

### Gemini
1. Get API key from [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. Model: `gemini-pro` (or `gemini-pro-vision`)

### Ollama (Local, No API Key)
1. Install from [ollama.ai](https://ollama.ai)
2. Run: `ollama pull llama2`
3. Keep running: `ollama serve`

### OpenRouter
1. Get API key from [openrouter.ai](https://openrouter.ai/keys)
2. Choose any model (Claude, GPT-4, Gemini, etc.)

---

## 🌟 Why OpenCopilot?

✅ **No build process** - Just load and go  
✅ **Privacy-focused** - Your choice of AI service  
✅ **Beautiful UI** - Professional dark theme  
✅ **Conversation history** - Never lose context  
✅ **Mindmap support** - Visual thinking  
✅ **Multi-view** - Sidebar or modal  
✅ **Markdown rendering** - Formatted responses  
✅ **Local fonts & libs** - CSP compliant, works offline  

---

## 📚 Documentation

- [Quick Start Guide](docs/QUICKSTART.md)
- [Complete Features](docs/FEATURES.md)
- [Installation Guide](docs/INSTALLATION.md)
- [All Updates](docs/CHANGELOG.md)

---

## 🛠️ Development

### Making Changes
1. Edit any `.js`, `.html`, or `.css` file
2. Go to `chrome://extensions/`
3. Click reload on OpenCopilot
4. Changes are live!

No build process, no dependencies, pure vanilla JavaScript!

---

## 📝 License

MIT License - Free for personal and commercial use

---

## 🙏 Credits

- Font: [Lato](https://fonts.google.com/specimen/Lato) by Google Fonts
- Markdown: [marked.js](https://marked.js.org/)
- Diagrams: [Mermaid.js](https://mermaid.js.org/)

---

**Made with ❤️ - Pure Vanilla JavaScript**

Press `Cmd+Shift+H` and experience AI-powered web browsing! 🚀

