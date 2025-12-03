# ⚡ OpenCopilot - Your AI Companion for the Web

<div align="center">

**Transform any webpage into an intelligent conversation. 100% customizable. 100% private (if you want).**

*Works on Chrome, Edge, Brave, Opera, Vivaldi, Firefox & all major browsers*

![Chromium Compatible](https://img.shields.io/badge/Chromium-Compatible-4285F4?style=flat-square)
![Firefox Compatible](https://img.shields.io/badge/Firefox-Compatible-FF7139?style=flat-square)
![Multi-AI](https://img.shields.io/badge/AI-Multi--Provider-00D9FF?style=flat-square)
![Privacy First](https://img.shields.io/badge/Privacy-100%25_Local_Option-10b981?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.1.0-blue?style=flat-square)

</div>

## 🌟 What Makes OpenCopilot Different?


Use it as a "Sidebar" to ask any question about the web page
Or just ask anything in general.

<img width="600" alt="image" src="https://gecgithub01.walmart.com/n0s00jx/OpenCopilot/assets/20577/8cfce445-953e-458f-9482-74970e135eb4">

Or a full screen modal to have a focussed chat session.

<img width="600" alt="image" src="https://gecgithub01.walmart.com/n0s00jx/OpenCopilot/assets/20577/49f31172-e7cd-45c1-8b86-76d9a56f00ed">

Generate Mermaid Mindmaps, visualise key information from the page

<img width="600" alt="image" src="https://gecgithub01.walmart.com/n0s00jx/OpenCopilot/assets/20577/4ee19690-8f17-4a30-a201-3ee6f60f7b7f">



### 🔒 **Your Data, Your Rules**
- **100% Local Mode Available** - Use Ollama and your data never leaves your machine
- **Choose Your Provider** - Switch between cloud (fast) or local (private) AI
- **No Vendor Lock-in** - Works with Groq, Gemini, Ollama, OpenRouter, and more

### 🌐 **Universal Compatibility**
Built for **all major browsers**:
- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Brave Browser
- ✅ Opera / Opera GX
- ✅ Vivaldi
- ✅ Arc Browser
- ✅ Any Chromium-based browser

### ⚡ **Zero Build Process**
Pure Vanilla JavaScript. Clone → Load → Done. No npm, no webpack, no headaches.

---

## 🚀 Quick Start

### Installation (30 seconds)

#### For Chrome, Edge, Brave, Opera, Vivaldi, Arc, etc.

1. Open your browser's extensions page:
   - **Chrome/Edge/Brave**: `chrome://extensions/` or `edge://extensions/`
   - **Opera**: `opera://extensions/`
   - **Or**: Menu → Extensions → Manage Extensions
2. Enable **"Developer mode"** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the **Chrome extension** folder
5. Done! ✨

#### For Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click **"This Firefox"** (in the left sidebar)
3. Click **"Load Temporary Add-on..."**
4. Navigate to the **Firefox extension** folder
5. Select the `manifest.json` file
6. Done! ✨

> **Note for Firefox users**: Temporary add-ons are removed when Firefox is closed. For permanent installation, you'll need to sign the extension through [addons.mozilla.org](https://addons.mozilla.org) or use Firefox Developer Edition/Nightly with `xpinstall.signatures.required` set to `false` in `about:config`.

### First Use

1. Click the OpenCopilot icon in your browser toolbar
2. Choose your AI provider:
   - **Fast & Cloud**: Groq, Gemini, OpenRouter
   - **Private & Local**: Ollama, LM Studio (no data leaves your computer)
3. Click the extension icon in your browser toolbar to activate on any webpage
4. Start chatting with AI about the page!

---

## ✨ Key Features

### 🤖 Multiple AI Providers - Your Choice, Your Way

OpenCopilot gives you the freedom to choose based on your priorities:

#### ☁️ **Cloud-Based (Fast & Powerful)**
- **Groq** - ⚡ Blazing fast inference with Mixtral, Llama models
- **Gemini** - 🌟 Google's state-of-the-art AI (Gemini Pro)
- **OpenRouter** - 🌐 Access to 100+ models including Claude 3.5, GPT-4, and more

#### 🔒 **Local & Private (100% Offline)**
- **Ollama** - 🦙 **Run AI completely on your machine**
  - 🔐 **Zero data sent to cloud** - Your conversations never leave your computer
  - 🚀 **No API keys needed** - Completely free to use
  - 🌍 **Works offline** - Internet connection not required
  - 💻 **Popular models**: Llama 3.2, Mistral, CodeLlama, Phi-3, and more
  - 📦 **Easy setup**: `ollama pull llama3.2` and you're ready!

- **LM Studio** - 🖥️ **Desktop app for local AI with a beautiful UI**
  - 🎨 **User-friendly interface** - Easy model management and testing
  - 🔒 **100% Private** - All processing happens locally
  - 🚀 **No API keys needed** - Free to use
  - 💾 **Huge model library** - Browse and download models with one click
  - ⚡ **Fast performance** - Optimized inference on your hardware
  - 🌐 **OpenAI-compatible API** - Works seamlessly with OpenCopilot
  
**Perfect for**: Sensitive work, privacy advocates, developers, offline usage, or anyone who wants full control over their AI.

### 📊 Built-in Usage Statistics
- 🌐 Track sites you've used OpenCopilot on
- ⁉️ Count questions asked across all sessions
- Real-time updates in the header

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
OpenCopilot/
├── README.md                  # This file
├── Chrome extension/          # Chrome/Chromium browsers
│   ├── manifest.json          # Chrome extension configuration
│   ├── background.js          # Service worker (Manifest V3)
│   ├── content.js             # Page content injection
│   ├── sidebar.html/js/css    # Sidebar interface
│   ├── modal.html/css         # Modal interface
│   ├── settings.html/js/css   # Settings page
│   ├── aiService.js           # AI integrations
│   ├── htmlToMarkdown.js      # HTML converter
│   └── assets/
│       ├── icons/             # Extension icons
│       ├── fonts/             # Lato font files
│       └── libs/              # marked.js, mermaid.js
│
└── Firefox extension/         # Firefox browser
    ├── manifest.json          # Firefox extension configuration
    ├── background.js          # Background script (Firefox-compatible)
    ├── content.js             # Page content injection
    ├── sidebar.html/js/css    # Sidebar interface
    ├── modal.html/css         # Modal interface
    ├── settings.html/js/css   # Settings page
    ├── aiService.js           # AI integrations
    ├── htmlToMarkdown.js      # HTML converter
    └── assets/
        ├── icons/             # Extension icons
        ├── fonts/             # Lato font files
        └── libs/              # marked.js, mermaid.js
```

---

## 🎯 Usage

### Opening OpenCopilot
**Click the extension icon** or use keyboard shortcuts:
- **`Ctrl+Shift+O`** / **`⌘+Shift+O`** - Open AI Assistant
- **`Ctrl+Shift+S`** / **`⌘+Shift+S`** - Open AI Assistant Sidebar
- **`Ctrl+Shift+K`** / **`⌘+Shift+K`** - Open Settings

Works the same across Chrome, Firefox, Edge, Brave, Opera, Vivaldi, and all major browsers!

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

### 🦙 Ollama - 100% Local & Private (Recommended for Privacy)

**Why Ollama?**
- ✅ **Completely FREE** - No API costs ever
- ✅ **100% Private** - Data never leaves your machine
- ✅ **No Internet Required** - Works completely offline
- ✅ **No API Keys** - Zero setup complexity

**Setup in 3 minutes:**

```bash
# 1. Install Ollama (Mac/Linux/Windows)
# Download from: https://ollama.ai

# 2. Pull a model (choose one)
ollama pull llama3.2          # General purpose (3GB)
ollama pull mistral           # Fast & efficient (4GB)
ollama pull codellama         # Code-focused (7GB)
ollama pull phi3              # Lightweight (2GB)

# 3. Start Ollama (it runs in the background)
ollama serve
```

**In OpenCopilot:**
1. Select "Ollama" as your AI service
2. URL: `http://localhost:11434` (default)
3. Select your model from the dropdown (auto-detected!)
4. Done! All processing happens on your machine 🔒

---

### 🖥️ LM Studio - Local AI with Beautiful UI

**Why LM Studio?**
- ✅ **User-Friendly** - Beautiful desktop app with intuitive interface
- ✅ **100% Private** - All processing happens locally
- ✅ **Completely FREE** - No API costs ever
- ✅ **No Internet Required** - Works completely offline
- ✅ **Huge Model Library** - Browse and download models with one click

**Setup in 3 minutes:**

1. **Download LM Studio**
   - Visit [lmstudio.ai](https://lmstudio.ai)
   - Download for Mac, Windows, or Linux
   - Install and launch the app

2. **Download a Model**
   - Click "Search" in LM Studio
   - Browse popular models (Llama, Mistral, Phi, etc.)
   - Click download on your preferred model
   - Wait for download to complete

3. **Start Local Server**
   - Click the "↔" Local Server tab in LM Studio
   - Click "Start Server" (default port: 1234)
   - Server will show "Running" status

**In OpenCopilot:**
1. Select "LM Studio" as your AI service
2. URL: `http://localhost:1234` (default)
3. Model will be auto-detected from LM Studio
4. Done! Enjoy your local AI with a beautiful UI 🎨

---

### ☁️ Cloud Providers (Fast, API Required)

#### Groq (Fastest)
1. Get free API key from [console.groq.com](https://console.groq.com/keys)
2. Model: `mixtral-8x7b-32768` or other Groq models
3. ⚡ Known for extremely fast inference speeds

#### Google Gemini
1. Get API key from [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. Model: `gemini-pro` or `gemini-pro-vision`
3. ✨ Google's latest AI technology

#### OpenRouter (Most Flexible)
1. Get API key from [openrouter.ai](https://openrouter.ai/keys)
2. Choose from 100+ models:
   - `anthropic/claude-3.5-sonnet` - Best reasoning
   - `openai/gpt-4-turbo` - Most capable
   - `google/gemini-pro` - Fast & smart
   - And many more!
3. 🌐 One API for all major AI models

---

## 🌟 Why OpenCopilot?

### 🔐 Privacy & Control
✅ **100% Local Options** - Use Ollama or LM Studio for complete privacy  
✅ **Multi-Provider** - Choose cloud or local based on your needs  
✅ **Your Data, Your Choice** - No forced cloud services  

### 🌐 Universal Compatibility
✅ **All Major Browsers** - Chrome, Firefox, Edge, Brave, Opera, Vivaldi, Arc  
✅ **Cross-Platform** - Windows, macOS, Linux  
✅ **Browser-Optimized** - Separate builds for Chrome & Firefox  

### ⚡ Developer Friendly
✅ **No Build Process** - Just load and go  
✅ **Pure Vanilla JavaScript** - No frameworks, no dependencies  
✅ **CSP Compliant** - Works with strict security policies  
✅ **Open Source** - Inspect, modify, learn  

### 🎨 Beautiful & Functional
✅ **Professional Dark UI** - Easy on the eyes  
✅ **Dual View Modes** - Sidebar or fullscreen modal  
✅ **Markdown & Mermaid** - Rich formatted responses with diagrams  
✅ **Conversation History** - Per-URL persistence  
✅ **Usage Statistics** - Track your AI interactions  
✅ **Auto-Detect Models** - Ollama models load automatically  

### 🚀 Smart Features
✅ **Context-Aware** - Automatically analyzes page content  
✅ **Quick Actions** - One-click summaries, bullet points, mindmaps  
✅ **Keyboard Shortcuts** - Two shortcuts for AI assistant and settings (customizable in `chrome://extensions/shortcuts`)  
✅ **Inline Settings** - Configure without leaving the page  

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

## 🎯 Use Cases

### 🔒 **Privacy-Conscious Users**
Run Ollama or LM Studio locally and keep all your conversations on your machine. Perfect for:
- Analyzing confidential documents
- Working with proprietary information
- General privacy concerns
- Offline environments

### 💼 **Professionals & Students**
- Research papers and articles
- Technical documentation
- Learning new concepts
- Quick summaries of long content

### 👨‍💻 **Developers**
- Understanding code documentation
- Analyzing GitHub repos
- Learning new frameworks
- Stack Overflow deep dives

### 🌍 **Multi-Browser Users**
Switch between Chrome, Firefox, Edge, Brave, or any modern browser - OpenCopilot works everywhere!

---

## 🤝 Contributing

OpenCopilot is open source and built with pure vanilla JavaScript. Contributions welcome!

- 🐛 Found a bug? Open an issue
- 💡 Have an idea? Start a discussion  
- 🔧 Want to contribute? Submit a PR

---

**Made with ❤️ using Pure Vanilla JavaScript**

*No frameworks. No build tools. No complexity.*

Use the keyboard shortcuts (`Ctrl+Shift+O` for assistant, `Ctrl+Shift+K` for settings) and experience AI-powered web browsing with complete privacy control! 🚀

---

<div align="center">

**Your Web. Your AI. Your Privacy.**

*Works on Chrome • Firefox • Edge • Brave • Opera • Vivaldi • Arc • All Major Browsers*

</div>

