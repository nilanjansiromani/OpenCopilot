# 🎯 Features Overview

Detailed breakdown of all features in Highlightr.

## 🎨 User Interface

### Modern ChatGPT-like Design
- **Gradient Theme**: Beautiful purple gradient (#667eea to #764ba2)
- **Message Bubbles**: Distinct styling for user and AI messages
  - User messages: Purple gradient background, right-aligned
  - AI messages: White background with subtle border, left-aligned
- **Smooth Animations**: 
  - Slide-in effect for new messages
  - Typing indicator with animated dots
  - Hover effects on buttons
- **Responsive Layout**: 
  - 20% width sidebar (minimum 400px)
  - Adapts to different screen heights
  - Custom scrollbar styling

### Interface Components

#### Header
- Extension name with icon
- Current page title display
- Settings button (gear icon)
- Close button with keyboard shortcut hint

#### Messages Area
- Scrollable message list
- User avatars (colored circles with initials)
- AI avatars (icon with gradient background)
- Timestamp support (for future enhancement)
- Auto-scroll to latest message

#### Input Area
- Multi-line text input
- Auto-expanding textarea (max 120px height)
- Send button with gradient background
- Keyboard shortcuts:
  - `Enter`: Send message
  - `Shift+Enter`: New line
- Input hint below textarea

#### Quick Action Pills
- Displayed when conversation starts
- Three default actions:
  - **Summarize**: Extract main points
  - **Bullet Points**: Create structured summary
  - **New Terms**: Explain key concepts
- Hover effects and animations
- Icon + label combination

## 🤖 AI Integration

### Multiple Service Support

#### Groq Integration
- **Models Available**:
  - Mixtral 8x7B (32K context) - Recommended
  - Llama 2 70B (4K context)
  - Gemma 7B (8K context)
- **Features**:
  - Fast inference (sub-second responses)
  - OpenAI-compatible API
  - Generous free tier
- **Configuration**:
  - API key required
  - Model selection in settings

#### Ollama Integration
- **Local AI**: Runs entirely on your machine
- **Privacy**: No data leaves your computer
- **Models Supported**: Any Ollama model
  - llama2, llama3
  - mistral, mixtral
  - codellama
  - phi-2, gemma
  - And many more...
- **Configuration**:
  - URL configuration (default: localhost:11434)
  - Model name input
  - Connection status check

#### OpenRouter Integration
- **Access to 100+ models**:
  - Anthropic Claude (3.5 Sonnet, 3 Opus)
  - OpenAI GPT-4 (Turbo, Vision)
  - Google Gemini (Pro, Ultra)
  - Meta Llama 3 (8B, 70B)
  - And many others...
- **Pay-as-you-go**: Only pay for what you use
- **Configuration**:
  - API key required
  - Model selection dropdown

### Context Management

#### Page Content Extraction
- **Automatic**: Triggers when sidebar opens
- **Intelligent Selection**:
  - Prioritizes `<main>` tag
  - Falls back to `<article>` tag
  - Uses `.content` or `#content` if present
  - Last resort: entire `<body>`
- **Cleanup**:
  - Removes `<script>` tags
  - Removes `<style>` tags
  - Removes `<nav>`, `<header>`, `<footer>`
  - Removes ads and tracking elements

#### HTML to Markdown Conversion
- **Library**: Turndown.js
- **Features**:
  - Preserves headers (# syntax)
  - Converts links `[text](url)`
  - Handles code blocks (```)
  - Preserves lists (bullet and numbered)
  - Converts tables
  - Handles images
- **Optimizations**:
  - Removes excessive whitespace
  - Cleans up empty paragraphs
  - Normalizes line breaks

#### System Prompt
The AI receives context in this format:
```
You are a helpful AI assistant analyzing a web page.

Title: [Page Title]
URL: [Page URL]

Page Content:
[Markdown converted content]

Please answer the user's questions based on this content.
```

## ⌨️ Keyboard Shortcuts

### Global Shortcuts
- **`Cmd+Shift+H`** (Mac): Toggle sidebar
- **`Ctrl+Shift+H`** (Windows/Linux): Toggle sidebar

### Input Shortcuts
- **`Enter`**: Send message
- **`Shift+Enter`**: Insert new line

### Future Shortcuts (Coming Soon)
- **`Cmd+K`**: Clear conversation
- **`Cmd+/`**: Show shortcuts help
- **`Esc`**: Close sidebar

## 💾 Settings & Storage

### Chrome Sync Storage
- Settings sync across devices
- Secure API key storage
- Automatic backup

### Configurable Options
- **Service Selection**: Groq, Ollama, or OpenRouter
- **API Keys**: Separate storage for each service
- **Model Selection**: Service-specific models
- **Ollama URL**: Configurable endpoint

### Settings Interface
- Beautiful gradient design
- Service-specific sections
- Inline help text with links
- Validation before saving
- Success/error notifications
- Reset to defaults option

## 🔒 Privacy & Security

### Data Protection
- **Local Storage**: API keys stored locally in Chrome
- **No Tracking**: No analytics or user tracking
- **Minimal Permissions**: Only requests necessary permissions
- **Secure Communication**: All API calls use HTTPS

### What Gets Sent
- **To AI Services**: Only page content and your messages
- **Never Sent**: Browsing history, personal data, cookies

### Privacy by Design
- Content extraction only when you open the sidebar
- No background processing
- No persistent connections
- Clear what data is being analyzed

## 🎯 Smart Features

### Quick Actions

#### Summarize
- Extracts main points from the page
- Provides concise overview
- Highlights key information
- Length: 2-3 paragraphs

#### Bullet Points
- Structured summary format
- Key points as bullet list
- Organized by topic
- Easy to scan

#### New Terms
- Identifies technical vocabulary
- Explains key concepts
- Provides definitions
- Links to related ideas

### Context-Aware Responses
- AI knows what page you're on
- References specific content
- Can answer detailed questions
- Maintains conversation context

### Auto-Refresh Content
- Re-captures page content when reopening
- Stays synchronized with page state
- Handles dynamic content updates

## 🛠️ Technical Features

### Extension Architecture
- **Manifest V3**: Latest Chrome extension standard
- **Service Worker**: Efficient background processing
- **Content Scripts**: Minimal page impact
- **Isolated iframe**: Prevents style conflicts

### Performance
- **Lazy Loading**: Sidebar only loads when needed
- **Efficient Rendering**: React with optimized re-renders
- **Minimal Bundle**: Optimized webpack configuration
- **Fast Startup**: Sub-second initialization

### Cross-Browser Compatible
- Chrome (primary support)
- Edge (Chromium-based)
- Brave
- Opera
- Other Chromium browsers

## 🚀 Future Features (Roadmap)

### Coming Soon
- [ ] Conversation history
- [ ] Export conversations
- [ ] Custom quick actions
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Text-to-speech responses
- [ ] Screenshot analysis
- [ ] PDF support
- [ ] Video transcript analysis
- [ ] Collaborative annotations

### Under Consideration
- [ ] Browser bookmark integration
- [ ] Integration with note-taking apps
- [ ] Voice input support
- [ ] Custom AI prompts library
- [ ] Team/shared configurations
- [ ] Browser sidebar API support

---

Have ideas for new features? Open an issue on GitHub!

