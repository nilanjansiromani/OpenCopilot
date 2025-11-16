// Sidebar JavaScript - Vanilla JS (no React, no build process)

let messages = [];
let isLoading = false;
let pageContent = null;
let pageMarkdown = '';
let settings = null;
let currentService = '';
let currentUrl = '';

const quickPromptTemplates = {
  summarize: 'Please provide a concise summary of the main points and key information from this web page.',
  bullets: 'Please summarize this web page into clear, concise bullet points covering the main topics and important details.',
  terms: 'Please identify and explain the key terms, concepts, and technical vocabulary from this web page.',
  mindmap: 'Please create a mindmap of this web page content in Mermaid.js format. Use the mindmap syntax with a root node and organize the key topics, subtopics, and concepts hierarchically. Format it as a Mermaid code block.'
};

const serviceIcons = {
  groq: '🚀',
  gemini: '✨',
  ollama: '🦙',
  openrouter: '🌐'
};

const serviceNames = {
  groq: 'Groq',
  gemini: 'Gemini',
  ollama: 'Ollama',
  openrouter: 'OpenRouter'
};

// DOM Elements
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const closeBtn = document.getElementById('closeBtn');
const settingsBtn = document.getElementById('settingsBtn');
const pageInfo = document.getElementById('pageInfo');
const pageTitle = document.getElementById('pageTitle');
const serviceBadge = document.getElementById('serviceBadge');
const errorBanner = document.getElementById('errorBanner');
const errorMessage = document.getElementById('errorMessage');
const closeError = document.getElementById('closeError');
const quickPrompts = document.getElementById('quickPrompts');
const settingsPanel = document.getElementById('settingsPanel');
const settingsPanelClose = document.getElementById('settingsPanelClose');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const serviceSelect = document.getElementById('serviceSelect');
const settingsConfirmation = document.getElementById('settingsConfirmation');
const modalToggleBtn = document.getElementById('modalToggleBtn');

// Load settings
function loadSettings() {
  chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
    if (response) {
      settings = response;
      currentService = response.service || 'groq';
      updateServiceBadge();
      populateSettingsPanel();
    }
  });
}

loadSettings();

// Initialize Mermaid
if (typeof mermaid !== 'undefined') {
  mermaid.initialize({ 
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#1e3c72',
      primaryTextColor: '#e2e8f0',
      primaryBorderColor: '#60a5fa',
      lineColor: '#60a5fa',
      secondaryColor: '#2a5298',
      tertiaryColor: '#051020',
      background: '#0a1628',
      mainBkg: '#0a1628',
      secondBkg: '#051020',
      textColor: '#e2e8f0',
      border1: '#60a5fa',
      border2: '#3b82f6',
      fontFamily: 'Lato, sans-serif'
    }
  });
}

// Save conversation history
function saveConversationHistory() {
  if (!currentUrl) return;
  
  const historyKey = `conversation_${currentUrl}`;
  const conversationData = {
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp.toISOString(),
      isError: m.isError
    })),
    lastUpdated: new Date().toISOString()
  };
  
  chrome.storage.local.set({ [historyKey]: conversationData }, () => {
    console.log('Conversation saved for:', currentUrl);
  });
}

// Load conversation history
function loadConversationHistory(url) {
  const historyKey = `conversation_${url}`;
  
  chrome.storage.local.get([historyKey], (result) => {
    if (result[historyKey] && result[historyKey].messages) {
      console.log('Loading conversation history for:', url);
      const savedMessages = result[historyKey].messages;
      
      // Clear current messages
      messages = [];
      messagesList.innerHTML = '';
      
      // Restore messages
      savedMessages.forEach(msg => {
        const timestamp = new Date(msg.timestamp);
        addMessageWithoutSave(msg.role, msg.content, msg.isError, timestamp);
      });
      
      // Hide quick prompts if there are user messages
      if (messages.some(m => m.role === 'user')) {
        quickPrompts.style.display = 'none';
      }
    } else {
      // No history, add welcome message
      if (pageContent) {
        addMessage('assistant', `I've analyzed the page "${pageContent.title}". You can ask me anything about it, or use one of the quick prompts below!`);
      }
    }
  });
}

// Listen for page content from parent
window.addEventListener('message', (event) => {
  if (event.data.type === 'PAGE_CONTENT') {
    pageContent = event.data.content;
    pageMarkdown = htmlToMarkdown(pageContent.htmlContent || '');
    currentUrl = pageContent.url;
    
    // Update UI
    pageTitle.textContent = pageContent.title;
    pageInfo.style.display = 'block';
    
    // Load conversation history for this URL
    loadConversationHistory(currentUrl);
  } else if (event.data.type === 'SYNC_MESSAGES') {
    // Sync messages from another view (sidebar <-> modal)
    console.log('Syncing messages from other view');
    messages = event.data.messages.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp)
    }));
    
    // Re-render messages
    messagesList.innerHTML = '';
    messages.forEach(msg => {
      addMessageWithoutSave(msg.role, msg.content, msg.isError, msg.timestamp);
    });
  }
});

// Request page content on load
window.parent.postMessage({ type: 'GET_PAGE_CONTENT' }, '*');

// Update service badge
function updateServiceBadge() {
  const icon = serviceIcons[currentService] || '🤖';
  const name = serviceNames[currentService] || 'AI';
  
  // Get model name based on service
  let modelName = '';
  if (settings) {
    switch (currentService) {
      case 'groq':
        modelName = settings.groqModel || 'mixtral-8x7b';
        break;
      case 'gemini':
        modelName = settings.geminiModel || 'gemini-pro';
        break;
      case 'ollama':
        modelName = settings.ollamaModel || 'llama2';
        break;
      case 'openrouter':
        modelName = settings.openRouterModel || 'claude-3.5';
        break;
    }
    // Shorten long model names
    if (modelName.length > 20) {
      modelName = modelName.substring(0, 20) + '...';
    }
  }
  
  serviceBadge.innerHTML = `<span>${icon}</span><span>${name}</span>${modelName ? `<span style="opacity: 0.8; font-size: 10px;"> • ${modelName}</span>` : ''}`;
}

// Format timestamp
function formatTimestamp(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Add message to UI (with save)
function addMessage(role, content, isError = false) {
  const timestamp = new Date();
  addMessageWithoutSave(role, content, isError, timestamp);
  saveConversationHistory();
}

// Add message to UI (without saving - used for loading history)
function addMessageWithoutSave(role, content, isError = false, timestamp = new Date()) {
  const message = { role, content, timestamp, isError };
  messages.push(message);
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const avatar = document.createElement('div');
  avatar.className = `message-avatar ${role}-avatar`;
  avatar.textContent = role === 'user' ? 'You' : '⚡';
  
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  
  // Add message header with author and timestamp
  const header = document.createElement('div');
  header.className = 'message-header';
  
  const author = document.createElement('span');
  author.className = 'message-author';
  author.textContent = role === 'user' ? 'You' : 'OpenCopilot';
  
  const time = document.createElement('span');
  time.className = 'message-timestamp';
  time.textContent = formatTimestamp(timestamp);
  
  header.appendChild(author);
  header.appendChild(time);
  bubble.appendChild(header);
  
  const text = document.createElement('div');
  text.className = 'message-text';
  
  // Render markdown for assistant messages, plain text for user
  if (role === 'assistant' && typeof marked !== 'undefined') {
    try {
      // Check if content contains mermaid diagram
      if (content.includes('```mermaid') || content.includes('mindmap')) {
        // Parse markdown first
        const html = marked.parse(content);
        text.innerHTML = html;
        
        // Find and render mermaid diagrams
        setTimeout(() => {
          const mermaidBlocks = text.querySelectorAll('code.language-mermaid, pre code');
          mermaidBlocks.forEach((block, index) => {
            const code = block.textContent;
            if (code.includes('mindmap') || code.includes('graph') || code.includes('flowchart')) {
              const container = document.createElement('div');
              container.className = 'mermaid-container';
              container.style.background = 'rgba(10, 22, 40, 0.5)';
              container.style.padding = '20px';
              container.style.borderRadius = '8px';
              container.style.margin = '16px 0';
              container.style.border = '1px solid rgba(96, 165, 250, 0.2)';
              
              const mermaidDiv = document.createElement('div');
              mermaidDiv.className = 'mermaid';
              mermaidDiv.textContent = code;
              container.appendChild(mermaidDiv);
              
              // Replace code block with mermaid container
              block.parentElement.replaceWith(container);
              
              // Render mermaid
              if (typeof mermaid !== 'undefined') {
                mermaid.run({ nodes: [mermaidDiv] });
              }
            }
          });
        }, 100);
      } else {
        text.innerHTML = marked.parse(content);
      }
    } catch (e) {
      text.textContent = content;
    }
  } else {
    text.textContent = content;
  }
  
  bubble.appendChild(text);
  contentDiv.appendChild(avatar);
  contentDiv.appendChild(bubble);
  messageDiv.appendChild(contentDiv);
  
  messagesList.appendChild(messageDiv);
  
  // Scroll to bottom (with delay to account for mermaid rendering)
  setTimeout(() => {
    const container = document.getElementById('messagesContainer');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, 200);
  
  // Hide quick prompts after first user message
  if (role === 'user' && messages.filter(m => m.role === 'user').length === 1) {
    quickPrompts.style.display = 'none';
  }
}

// Show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message assistant';
  typingDiv.id = 'typingIndicator';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar assistant-avatar';
  avatar.textContent = '⚡';
  
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  
  // Add message header
  const header = document.createElement('div');
  header.className = 'message-header';
  
  const author = document.createElement('span');
  author.className = 'message-author';
  author.textContent = 'OpenCopilot';
  
  const time = document.createElement('span');
  time.className = 'message-timestamp';
  time.textContent = formatTimestamp(new Date());
  
  header.appendChild(author);
  header.appendChild(time);
  bubble.appendChild(header);
  
  const indicatorWrapper = document.createElement('div');
  indicatorWrapper.className = 'message-text';
  indicatorWrapper.style.paddingTop = '4px';
  
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = '<span></span><span></span><span></span>';
  
  indicatorWrapper.appendChild(indicator);
  bubble.appendChild(indicatorWrapper);
  contentDiv.appendChild(avatar);
  contentDiv.appendChild(bubble);
  typingDiv.appendChild(contentDiv);
  
  messagesList.appendChild(typingDiv);
  messagesList.scrollTop = messagesList.scrollHeight;
}

// Remove typing indicator
function hideTypingIndicator() {
  const typing = document.getElementById('typingIndicator');
  if (typing) {
    typing.remove();
  }
}

// Show error
function showError(message) {
  errorMessage.textContent = message;
  errorBanner.style.display = 'flex';
}

// Hide error
function hideError() {
  errorBanner.style.display = 'none';
}

// Send message
async function sendMessage(messageText = null) {
  const text = messageText || messageInput.value.trim();
  
  if (!text || isLoading) return;
  
  if (!settings || (!settings.groqApiKey && !settings.geminiApiKey && !settings.openRouterApiKey && settings.service !== 'ollama')) {
    showError('Please configure your API keys in settings first.');
    return;
  }
  
  hideError();
  messageInput.value = '';
  
  // Add user message
  addMessage('user', text);
  
  isLoading = true;
  sendBtn.disabled = true;
  messageInput.disabled = true;
  
  showTypingIndicator();
  
  try {
      // Prepare context
    const systemPrompt = `You are a helpful AI assistant analyzing a web page. Here is the page content in markdown format:

Title: ${pageContent?.title || 'Unknown'}
URL: ${pageContent?.url || 'Unknown'}

Page Content:
${pageMarkdown}

IMPORTANT: When creating tables, limit them to a maximum of 2 columns. If you need to present more data, use multiple tables or a different format.

Please answer the user's questions based on this content. Be concise and helpful.`;
    
    // Get conversation messages
    const conversationMessages = messages
      .filter(m => m.role !== 'system' && !m.isError)
      .map(m => ({ role: m.role, content: m.content }));
    
    // Call AI service
    const aiService = new AIService(settings);
    const response = await aiService.sendMessage(conversationMessages, systemPrompt);
    
    hideTypingIndicator();
    addMessage('assistant', response);
    
  } catch (error) {
    hideTypingIndicator();
    showError(error.message);
    addMessage('assistant', `Sorry, I encountered an error: ${error.message}`, true);
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
    messageInput.disabled = false;
    messageInput.focus();
  }
}

// Event Listeners
sendBtn.addEventListener('click', () => sendMessage());

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

closeBtn.addEventListener('click', () => {
  window.parent.postMessage({ type: 'CLOSE_SIDEBAR' }, '*');
});

// Modal toggle
if (modalToggleBtn) {
  modalToggleBtn.addEventListener('click', () => {
    console.log('Modal toggle clicked');
    // Send current messages to content script
    window.parent.postMessage({ 
      type: 'TOGGLE_MODAL',
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
        isError: m.isError
      }))
    }, '*');
  });
}

// Populate settings panel with current settings
function populateSettingsPanel() {
  if (!settings) return;
  
  serviceSelect.value = settings.service || 'groq';
  document.getElementById('groqApiKeyInput').value = settings.groqApiKey || '';
  document.getElementById('groqModelInput').value = settings.groqModel || 'mixtral-8x7b-32768';
  document.getElementById('geminiApiKeyInput').value = settings.geminiApiKey || '';
  document.getElementById('geminiModelInput').value = settings.geminiModel || 'gemini-pro';
  document.getElementById('ollamaUrlInput').value = settings.ollamaUrl || 'http://localhost:11434';
  document.getElementById('ollamaModelInput').value = settings.ollamaModel || 'llama2';
  document.getElementById('openRouterApiKeyInput').value = settings.openRouterApiKey || '';
  document.getElementById('openRouterModelInput').value = settings.openRouterModel || 'anthropic/claude-3.5-sonnet';
  
  updateServiceSettingsVisibility();
}

// Update which service settings are visible
function updateServiceSettingsVisibility() {
  const selected = serviceSelect.value;
  document.getElementById('groqSettings').style.display = selected === 'groq' ? 'block' : 'none';
  document.getElementById('geminiSettings').style.display = selected === 'gemini' ? 'block' : 'none';
  document.getElementById('ollamaSettings').style.display = selected === 'ollama' ? 'block' : 'none';
  document.getElementById('openrouterSettings').style.display = selected === 'openrouter' ? 'block' : 'none';
}

// Toggle settings panel
settingsBtn.addEventListener('click', () => {
  settingsPanel.classList.toggle('show');
});

// Close settings panel
settingsPanelClose.addEventListener('click', () => {
  settingsPanel.classList.remove('show');
});

// Service selector change
serviceSelect.addEventListener('change', updateServiceSettingsVisibility);

// Save settings
saveSettingsBtn.addEventListener('click', () => {
  const newSettings = {
    service: serviceSelect.value,
    groqApiKey: document.getElementById('groqApiKeyInput').value,
    groqModel: document.getElementById('groqModelInput').value || 'mixtral-8x7b-32768',
    geminiApiKey: document.getElementById('geminiApiKeyInput').value,
    geminiModel: document.getElementById('geminiModelInput').value || 'gemini-pro',
    ollamaUrl: document.getElementById('ollamaUrlInput').value || 'http://localhost:11434',
    ollamaModel: document.getElementById('ollamaModelInput').value || 'llama2',
    openRouterApiKey: document.getElementById('openRouterApiKeyInput').value,
    openRouterModel: document.getElementById('openRouterModelInput').value || 'anthropic/claude-3.5-sonnet'
  };
  
  chrome.runtime.sendMessage({ action: 'saveSettings', settings: newSettings }, (response) => {
    if (response.success) {
      settings = newSettings;
      currentService = newSettings.service;
      updateServiceBadge();
      settingsPanel.classList.remove('show');
      
      // Show confirmation
      const serviceName = serviceNames[newSettings.service] || 'AI';
      let modelName = '';
      switch (newSettings.service) {
        case 'groq': modelName = newSettings.groqModel; break;
        case 'gemini': modelName = newSettings.geminiModel; break;
        case 'ollama': modelName = newSettings.ollamaModel; break;
        case 'openrouter': modelName = newSettings.openRouterModel; break;
      }
      
      settingsConfirmation.innerHTML = `✓ You are now using <strong>${serviceName}</strong>. Model selected is <strong>${modelName}</strong>`;
      settingsConfirmation.classList.add('show');
      
      setTimeout(() => {
        settingsConfirmation.classList.remove('show');
      }, 4000);
    }
  });
});

closeError.addEventListener('click', hideError);

// Quick prompts
document.querySelectorAll('.quick-prompt-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const promptType = btn.getAttribute('data-prompt');
    const promptText = quickPromptTemplates[promptType];
    if (promptText) {
      sendMessage(promptText);
    }
  });
});

// Auto-focus input
messageInput.focus();

