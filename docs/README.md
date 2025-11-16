# 🚀 Highlightr - AI Co-Pilot Chrome Extension

A simple, powerful Chrome extension that brings AI co-pilot functionality to any web page. Analyze, summarize, and interact with web content using multiple AI services.

**✨ Pure Vanilla JavaScript - No build process required!**

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=for-the-badge&logo=javascript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 🎨 Clean, Professional UI
- Modern blue theme (#1e3c72)
- Smooth animations and transitions
- Message bubbles with chat interface
- Responsive sidebar overlay (20% width)

### 🤖 Multi-Service AI Support
- **Groq**: Fast inference with models like Mixtral 8x7B
- **Gemini**: Google's powerful AI models (Gemini Pro, Gemini Pro Vision)
- **Ollama**: Local AI models (Llama 2, Mistral, CodeLlama, etc.)
- **OpenRouter**: Access to Claude, GPT-4, and 100+ other models

### 🎯 Smart Page Analysis
- Automatic HTML content extraction
- HTML to Markdown conversion
- Context-aware responses about the page
- Real-time page content capture

### 💊 Quick Action Pills
- **Summarize**: Get a concise summary of the page
- **Bullet Points**: Extract key points in bullet format
- **New Terms**: Identify and explain key concepts

### ⌨️ Keyboard Shortcuts
- `Cmd+Shift+H` (Mac) or `Ctrl+Shift+H` (Windows/Linux) to toggle sidebar

## 🛠️ Installation

### Simple - No Build Process!

1. **Clone or download this repository**
```bash
git clone https://github.com/yourusername/highlightr.git
cd highlightr
```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `highlightr` folder (root directory)

That's it! No `npm install`, no `npm run build` - just load and go! 🎉

## 🔧 Configuration

### First Time Setup

1. Click the Highlightr icon in your Chrome toolbar
2. The settings page will open automatically
3. Choose your preferred AI service:
   - **Groq**: Get API key from [console.groq.com](https://console.groq.com/keys)
   - **Gemini**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Ollama**: Install from [ollama.ai](https://ollama.ai) and ensure it's running locally
   - **OpenRouter**: Get API key from [openrouter.ai](https://openrouter.ai/keys)

### API Keys

#### Groq
1. Visit [Groq Console](https://console.groq.com/keys)
2. Create an account or sign in
3. Generate a new API key
4. Paste it in the Highlightr settings
5. Enter your preferred model name (e.g., mixtral-8x7b-32768)

#### Gemini
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Paste it in the Highlightr settings
5. Enter model name (default: gemini-pro)

#### OpenRouter
1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Create an account or sign in
3. Generate a new API key
4. Paste it in the Highlightr settings
5. Enter your model name (e.g., anthropic/claude-3.5-sonnet)

#### Ollama (Local)
1. Download Ollama from [ollama.ai](https://ollama.ai)
2. Install and run Ollama
3. Pull a model: `ollama pull llama2`
4. Make sure Ollama is running (default: `http://localhost:11434`)
5. Enter the model name in settings

## 📖 Usage

### Opening the Sidebar

Press `Cmd+Shift+H` (Mac) or `Ctrl+Shift+H` (Windows/Linux) on any web page to open the AI co-pilot sidebar.

### Asking Questions

1. Type your question in the input field at the bottom
2. Press Enter or click the send button
3. The AI will respond based on the page content

### Using Quick Actions

Click on any of the quick action pills:
- **Summarize**: Get a summary of the page
- **Bullet Points**: Get key points in bullet format
- **New Terms**: Learn about key concepts on the page

## 📁 Project Structure

```
highlightr/
├── manifest.json           # Chrome extension manifest
├── background.js           # Service worker
├── content.js              # Content script (injected into pages)
├── sidebar.html            # Sidebar UI
├── sidebar.js              # Sidebar logic (vanilla JS)
├── sidebar.css             # Sidebar styling
├── settings.html           # Settings page UI
├── settings.js             # Settings page logic
├── aiService.js            # AI service integrations
├── htmlToMarkdown.js       # HTML to Markdown converter
├── icon*.png               # Extension icons
└── README.md               # This file
```

**All vanilla JavaScript - no React, no webpack, no babel, no build process!**

## 🔌 Supported AI Models

### Groq
- Mixtral 8x7B (32K context) - Recommended
- Llama 2 70B
- Gemma 7B
- Any model available on Groq (custom text input)

### Gemini
- Gemini Pro
- Gemini Pro Vision
- Future Gemini models

### Ollama (Local)
- Llama 2
- Mistral
- CodeLlama
- Phi-2
- And many more...

### OpenRouter
- Claude 3.5 Sonnet
- GPT-4 Turbo
- Gemini Pro
- Llama 3 70B
- And 100+ other models

## 🎨 UI Features

- **Professional Blue Theme**: Solid blue color scheme (#1e3c72, #2a5298)
- **Service Badge**: Shows active AI service with emoji icon
  - 🚀 Groq
  - ✨ Gemini
  - 🦙 Ollama
  - 🌐 OpenRouter
- **Message Bubbles**: Different styles for user and AI messages
- **Typing Indicator**: Animated dots while AI is thinking
- **Smooth Animations**: Slide-in effects for messages
- **Responsive Design**: Adapts to different screen sizes
- **Custom Scrollbar**: Styled scrollbar matching the theme

## 🔐 Privacy & Security

- API keys are stored locally using Chrome's sync storage
- No data is sent to external servers except your chosen AI service
- Page content is only extracted when you open the sidebar
- All communication with AI services uses secure HTTPS
- No tracking, no analytics, no telemetry

## 🐛 Troubleshooting

### Sidebar not appearing
- Check if you pressed the correct shortcut: `Cmd+Shift+H` (Mac) or `Ctrl+Shift+H`
- Make sure the extension is enabled in `chrome://extensions/`
- Try refreshing the page

### API errors
- Verify your API key is correct in settings
- For Groq/OpenRouter/Gemini: Check your API quota/credits
- For Ollama: Ensure Ollama is running (`ollama list` to check)

### "Settings not configured" error
- Click the extension icon to open settings
- Add your API key for your chosen service
- Save settings and try again

### Ollama connection failed
- Make sure Ollama is running: `ollama serve`
- Verify the URL is correct (default: `http://localhost:11434`)
- Check that you have a model downloaded: `ollama list`

## 🎯 Why Vanilla JavaScript?

This extension is intentionally built with **pure vanilla JavaScript** and **no build process** because:

- ✅ **Simplicity**: No webpack, babel, or complex tooling
- ✅ **Easy to understand**: Clear, readable code
- ✅ **Easy to modify**: Just edit files and reload extension
- ✅ **No dependencies**: No node_modules folder
- ✅ **Fast development**: Edit and test immediately
- ✅ **Educational**: Great for learning Chrome extensions
- ✅ **Direct loading**: Load straight into Chrome from repo

## 🔄 Making Changes

Want to customize the extension?

1. Edit any `.js`, `.html`, or `.css` file
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Highlightr extension
4. Test your changes immediately!

No build process, no waiting, no complexity.

## 🤝 Contributing

Contributions are welcome! The codebase is intentionally simple and easy to understand.

1. Fork the repository
2. Make your changes
3. Test locally by loading the unpacked extension
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Clean, professional UI design
- Built with vanilla JavaScript for simplicity
- Supports multiple AI services for flexibility

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ - Pure Vanilla JavaScript, No Build Process Required!**
