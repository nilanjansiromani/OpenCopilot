# 🚀 Quick Start Guide

Get up and running with Highlightr in 5 minutes!

## Step 1: Build the Extension

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

## Step 2: Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Navigate to and select the `dist` folder

## Step 3: Configure Your AI Service

### Option A: Using Groq (Recommended for beginners)

1. Click the Highlightr extension icon in Chrome
2. Select **"Groq"** as your service
3. Get a free API key:
   - Go to [console.groq.com](https://console.groq.com/keys)
   - Sign up for a free account
   - Create a new API key
4. Paste the API key in the settings
5. Choose your model (Mixtral 8x7B is recommended)
6. Click **"Save Settings"**

### Option B: Using Ollama (Local, no API key needed)

1. Download and install Ollama from [ollama.ai](https://ollama.ai)
2. Open Terminal and run:
   ```bash
   ollama pull llama2
   ollama serve
   ```
3. In Highlightr settings:
   - Select **"Ollama"** as your service
   - URL should be `http://localhost:11434`
   - Model name: `llama2` (or any model you pulled)
4. Click **"Save Settings"**

### Option C: Using OpenRouter (Most models available)

1. Click the Highlightr extension icon
2. Select **"OpenRouter"** as your service
3. Get an API key:
   - Go to [openrouter.ai/keys](https://openrouter.ai/keys)
   - Sign up and add credits to your account
   - Create a new API key
4. Paste the API key in the settings
5. Choose your preferred model (Claude, GPT-4, etc.)
6. Click **"Save Settings"**

## Step 4: Try It Out!

1. Navigate to any web page (try Wikipedia, a news article, or a blog post)
2. Press **`Cmd+Shift+H`** (Mac) or **`Ctrl+Shift+H`** (Windows/Linux)
3. The AI sidebar will appear on the right side
4. Try one of the quick action pills:
   - **Summarize**: Get a quick summary
   - **Bullet Points**: Extract key points
   - **New Terms**: Learn new concepts
5. Or ask your own questions about the page!

## Example Queries

Try asking questions like:
- "What is this article about?"
- "Can you explain the main concepts?"
- "What are the key takeaways?"
- "What technical terms are mentioned?"
- "How does this work?"

## Troubleshooting

### Sidebar not appearing?
- Make sure you pressed the correct keyboard shortcut
- Refresh the page and try again
- Check that the extension is enabled in `chrome://extensions/`

### API errors?
- Verify your API key is correct
- For Groq/OpenRouter: Check you have remaining credits
- For Ollama: Make sure `ollama serve` is running

### Settings not saving?
- Try opening settings from the extension icon
- Make sure you clicked "Save Settings"
- Check the browser console for any errors

## Development Mode

Want to modify the extension?

```bash
# Watch for changes and rebuild automatically
npm run dev

# After making changes, go to chrome://extensions/
# Click the refresh icon on the Highlightr extension
```

## Need Help?

- Read the full [README.md](README.md) for detailed information
- Check the code in the `src` folder
- Open an issue on GitHub

---

**Happy highlighting! 🎉**

