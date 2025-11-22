# Firefox Extension - Key Differences

This folder contains the Firefox-compatible version of OpenCopilot.

## Key Differences from Chrome Version

### 1. **Manifest Changes**
- Uses `background.scripts` instead of `background.service_worker` (Firefox Manifest V3 compatibility)
- Includes `browser_specific_settings` with gecko ID and minimum version
- Uses `options_ui` instead of `options_page` for better Firefox integration

### 2. **Background Script (background.js)**
- Uses `browser` API with `chrome` fallback for cross-compatibility
- Converted callback-based Chrome APIs to promise-based Firefox APIs
- Added `moz-extension://` to restricted protocols list

### 3. **Installation**
To load in Firefox:
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on..."
4. Select the `manifest.json` file from this folder

**Note**: Temporary add-ons are removed when Firefox closes. For permanent installation:
- Sign the extension through [addons.mozilla.org](https://addons.mozilla.org)
- Or use Firefox Developer/Nightly with `xpinstall.signatures.required` set to `false`

## Browser API Compatibility

The extension uses the `browser` API which is native to Firefox but also works with Chrome through the polyfill approach:

```javascript
const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;
```

This ensures the extension works in both browsers with minimal code changes.

## All Features Work the Same

- ✅ All AI providers (Groq, Gemini, OpenRouter, Ollama)
- ✅ Sidebar and Modal views
- ✅ Keyboard shortcuts
- ✅ Settings and storage
- ✅ Page analysis and markdown rendering
- ✅ Mermaid diagrams
- ✅ Conversation history

Enjoy using OpenCopilot on Firefox! 🦊

