// Sidebar JavaScript - Vanilla JS (no React, no build process)

let messages = [];
let isLoading = false;
let pageContent = null;
let pageMarkdown = '';
let settings = null;
let currentService = '';
let currentUrl = '';
let welcomeMessageAdded = false;
let usageStats = {
  sitesVisited: new Set(),
  questionsAsked: 0
};

// Default pills (fallback if no custom pills are saved)
const DEFAULT_PILLS = {
  tldr: {
    label: 'TLDR',
    prompt: 'Please provide a TLDR summary of this page in exactly 5 bullet points. Each bullet point must contain exactly 5 words. Be concise and capture the key essence.'
  },
  summarize: {
    label: 'Summarize',
    prompt: 'Please provide a concise summary of the main points and key information from this web page.'
  },
  bullets: {
    label: 'Bullets',
    prompt: 'Please summarize this web page into clear, concise bullet points covering the main topics and important details.'
  },
  terms: {
    label: 'Terms',
    prompt: 'Please identify and explain the key terms, concepts, and technical vocabulary from this web page.'
  },
  mindmap: {
    label: 'Mindmap',
    prompt: 'Please create a mindmap of this web page content in Mermaid.js format. Use the mindmap syntax with a root node and organize the key topics, subtopics, and concepts hierarchically. Format it as a Mermaid code block.'
  }
};

let quickPromptTemplates = {};

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
  lmstudio: 'LM Studio',
  openrouter: 'OpenRouter'
};

// DOM Elements
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const closeBtn = document.getElementById('closeBtn');
const settingsBtn = document.getElementById('settingsBtn');
const clearPageBtn = document.getElementById('clearPageBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
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
const contextToggle = document.getElementById('contextToggle');

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

// Load custom pills from storage
function loadCustomPills() {
  chrome.storage.sync.get(['customPills'], (result) => {
    if (result.customPills && Object.keys(result.customPills).length > 0) {
      // Use custom pills
      const customPills = result.customPills;
      quickPromptTemplates = {};
      
      // Convert to old format for compatibility
      Object.entries(customPills).forEach(([key, data]) => {
        quickPromptTemplates[key] = data.prompt;
      });
      
      console.log('Loaded custom pills:', Object.keys(quickPromptTemplates));
      renderQuickPrompts(customPills);
    } else {
      // Use default pills
      Object.entries(DEFAULT_PILLS).forEach(([key, data]) => {
        quickPromptTemplates[key] = data.prompt;
      });
      
      console.log('Using default pills');
      renderQuickPrompts(DEFAULT_PILLS);
    }
  });
}

// Render quick prompt buttons dynamically
function renderQuickPrompts(pills) {
  const quickPromptsContainer = document.getElementById('quickPrompts');
  if (!quickPromptsContainer) return;
  
  // Default icons for common pills
  const defaultIcons = {
    tldr: '⚡',
    summarize: '✨',
    bullets: '📋',
    terms: '📚',
    mindmap: '🧠',
    explain: '💡',
    translate: '🌍',
    code: '💻',
    analyze: '🔍',
    compare: '⚖️'
  };
  
  // Clear existing buttons
  quickPromptsContainer.innerHTML = '';
  
  // Create buttons for each pill
  Object.entries(pills).forEach(([key, data]) => {
    const button = document.createElement('button');
    button.className = 'quick-prompt-button';
    button.setAttribute('data-prompt', key);
    
    // Add icon
    const iconSpan = document.createElement('span');
    iconSpan.textContent = defaultIcons[key] || '💊';
    
    // Add label
    const labelSpan = document.createElement('span');
    labelSpan.textContent = data.label;
    
    button.appendChild(iconSpan);
    button.appendChild(labelSpan);
    quickPromptsContainer.appendChild(button);
  });
  
  // Add event listeners to new buttons
  document.querySelectorAll('.quick-prompt-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const promptType = btn.getAttribute('data-prompt');
      const promptText = quickPromptTemplates[promptType];
      if (promptText) {
        sendMessage(promptText);
      }
    });
  });
}

// Listen for pills updates from settings page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'pillsUpdated') {
    console.log('Pills updated, reloading...');
    loadCustomPills();
  }
});

loadCustomPills();

// Load usage stats
function loadUsageStats() {
  chrome.storage.local.get(['usageStats'], (result) => {
    if (result.usageStats) {
      usageStats.sitesVisited = new Set(result.usageStats.sitesVisited || []);
      usageStats.questionsAsked = result.usageStats.questionsAsked || 0;
    }
    updateStatsDisplay();
  });
}

// Save usage stats
function saveUsageStats() {
  const statsToSave = {
    sitesVisited: Array.from(usageStats.sitesVisited),
    questionsAsked: usageStats.questionsAsked
  };
  chrome.storage.local.set({ usageStats: statsToSave });
}

// Update stats display
function updateStatsDisplay() {
  const sitesCount = document.getElementById('sitesCount');
  const questionsCount = document.getElementById('questionsCount');
  
  if (sitesCount) {
    sitesCount.textContent = usageStats.sitesVisited.size;
  }
  if (questionsCount) {
    questionsCount.textContent = usageStats.questionsAsked;
  }
}

// Track site visit
function trackSiteVisit(url) {
  try {
    const hostname = new URL(url).hostname;
    if (!usageStats.sitesVisited.has(hostname)) {
      usageStats.sitesVisited.add(hostname);
      saveUsageStats();
      updateStatsDisplay();
    }
  } catch (error) {
    console.error('Error tracking site visit:', error);
  }
}

// Track question asked
function trackQuestionAsked() {
  usageStats.questionsAsked++;
  saveUsageStats();
  updateStatsDisplay();
}

loadUsageStats();

// Load context toggle state (default: true/ON)
function loadContextToggleState() {
  chrome.storage.local.get(['useWebPageContext'], (result) => {
    const useContext = result.useWebPageContext !== false; // Default to true
    if (contextToggle) {
      contextToggle.checked = useContext;
    }
  });
}

// Save context toggle state
function saveContextToggleState() {
  if (contextToggle) {
    chrome.storage.local.set({ useWebPageContext: contextToggle.checked });
  }
}

// Load toggle state on initialization
loadContextToggleState();

// Listen for toggle changes
if (contextToggle) {
  contextToggle.addEventListener('change', saveContextToggleState);
}

// Get welcome message based on toggle state
function getWelcomeMessage() {
  const useContext = contextToggle ? contextToggle.checked : true; // Default to true if toggle doesn't exist
  
  if (useContext && pageContent) {
    // Toggle is ON - show page analysis message
    return `I've analyzed the page "${pageContent.title}". You can ask me anything about it, or use one of the quick prompts below!`;
  } else {
    // Toggle is OFF - show friendly greeting
    return `Hello! I'm here to help. Feel free to ask me anything, or use one of the quick prompts below!`;
  }
}

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
      welcomeMessageAdded = false;
      
      // Restore messages
      savedMessages.forEach(msg => {
        const timestamp = new Date(msg.timestamp);
        addMessageWithoutSave(msg.role, msg.content, msg.isError, timestamp);
      });
      
      // Mark welcome message as added if first message is from assistant
      if (messages.length > 0 && messages[0].role === 'assistant') {
        welcomeMessageAdded = true;
      }
    } else {
      // No history, add welcome message if not already added
      if (!welcomeMessageAdded) {
        welcomeMessageAdded = true;
        addMessage('assistant', getWelcomeMessage());
      }
    }
  });
}

// Show settings confirmation message
function showSettingsConfirmation(message) {
  settingsConfirmation.innerHTML = message;
  settingsConfirmation.classList.add('show');
  
  setTimeout(() => {
    settingsConfirmation.classList.remove('show');
  }, 3000);
}

// Clear current page chat history
function clearCurrentPageChat() {
  if (!currentUrl) {
    alert('No page loaded yet!');
    return;
  }
  
  if (confirm(`Clear all chat history for this page?\n\n${pageContent?.title || currentUrl}`)) {
    const historyKey = `conversation_${currentUrl}`;
    
    chrome.storage.local.remove([historyKey], () => {
      // Clear UI
      messages = [];
      messagesList.innerHTML = '';
      welcomeMessageAdded = false;
      
      // Add welcome message again
      welcomeMessageAdded = true;
      addMessage('assistant', getWelcomeMessage());
      
      // Show confirmation
      showSettingsConfirmation('Chat history cleared for this page! 🗑️');
    });
  }
}

// Clear all conversations and reset stats
function clearAllData() {
  if (confirm('⚠️ Clear ALL conversations across all websites AND reset usage statistics?\n\nThis action cannot be undone!')) {
    // Get all storage keys
    chrome.storage.local.get(null, (items) => {
      const keysToRemove = [];
      
      // Find all conversation keys
      for (const key in items) {
        if (key.startsWith('conversation_') || key === 'usageStats') {
          keysToRemove.push(key);
        }
      }
      
      // Remove all conversations and stats
      chrome.storage.local.remove(keysToRemove, () => {
        // Reset stats
        usageStats.sitesVisited = new Set();
        usageStats.questionsAsked = 0;
        updateStatsDisplay();
        
        // Clear current chat
        messages = [];
        messagesList.innerHTML = '';
        welcomeMessageAdded = false;
        
        // Add welcome message again
        welcomeMessageAdded = true;
        addMessage('assistant', getWelcomeMessage());
        
        // Show confirmation
        showSettingsConfirmation('All conversations and stats cleared! 🗑️🌐');
      });
    });
  }
}

// Listen for page content from parent
window.addEventListener('message', (event) => {
  if (event.data.type === 'PAGE_CONTENT') {
    pageContent = event.data.content;
    pageMarkdown = htmlToMarkdown(pageContent.htmlContent || '');
    
    // Reset welcome message flag if URL changed
    if (currentUrl !== pageContent.url) {
      welcomeMessageAdded = false;
    }
    
    currentUrl = pageContent.url;
    
    // Track site visit
    trackSiteVisit(currentUrl);
    
    // Update UI with custom prefix
    pageTitle.textContent = `Answering everything on this page from ${pageContent.title}`;
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
    
    // Mark welcome message as added if messages exist
    if (messages.length > 0 && messages[0].role === 'assistant') {
      welcomeMessageAdded = true;
    }
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
  
  // Track question asked
  trackQuestionAsked();
  
  isLoading = true;
  sendBtn.disabled = true;
  messageInput.disabled = true;
  
  showTypingIndicator();
  
  try {
    // Check toggle state - if OFF, do not include page context
    const useContext = contextToggle ? contextToggle.checked : true; // Default to true if toggle doesn't exist
    
    // Prepare system prompt based on toggle state
    let systemPrompt;
    
    if (useContext) {
      // Toggle is ON - include web page context (current behavior)
      if (pageContent && pageMarkdown) {
        systemPrompt = `You are a helpful AI assistant analyzing a web page. Here is the page content in markdown format:

Title: ${pageContent.title || 'Unknown'}
URL: ${pageContent.url || 'Unknown'}

Page Content:
${pageMarkdown}

IMPORTANT: When creating tables, limit them to a maximum of 2 columns. If you need to present more data, use multiple tables or a different format.

Please answer the user's questions based on this content. Be concise and helpful.`;
      } else {
        // Page content not available, but toggle is on - use simple prompt
        systemPrompt = `You are a helpful AI assistant. Please answer the user's questions directly and concisely.

IMPORTANT: When creating tables, limit them to a maximum of 2 columns. If you need to present more data, use multiple tables or a different format.`;
      }
    } else {
      // Toggle is OFF - do NOT include page context, just answer the question
      systemPrompt = `You are a helpful AI assistant. Please answer the user's questions directly and concisely. Do not hallucinate or make up information.
      Seek clarification if needed. Always give me a level 3 answer and not a level 1 or level 0 shallow answer.
IMPORTANT: When creating tables, limit them to a maximum of 2 columns. If you need to present more data, use multiple tables or a different format.`;
    }
    
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

// Clear buttons
if (clearPageBtn) {
  clearPageBtn.addEventListener('click', clearCurrentPageChat);
}

if (clearAllBtn) {
  clearAllBtn.addEventListener('click', clearAllData);
}

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
  document.getElementById('lmstudioUrlInput').value = settings.lmstudioUrl || 'http://localhost:1234';
  document.getElementById('lmstudioModelInput').value = settings.lmstudioModel || 'local-model';
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
  document.getElementById('lmstudioSettings').style.display = selected === 'lmstudio' ? 'block' : 'none';
  document.getElementById('openrouterSettings').style.display = selected === 'openrouter' ? 'block' : 'none';
  
  // Fetch Ollama models if Ollama is selected
  if (selected === 'ollama') {
    fetchOllamaModelsSidebar();
  }
  
  // Fetch LM Studio models if LM Studio is selected
  if (selected === 'lmstudio') {
    fetchLMStudioModelsSidebar();
  }
}

// Fetch available models from Ollama API
async function fetchOllamaModelsSidebar() {
  const ollamaUrl = document.getElementById('ollamaUrlInput').value || 'http://localhost:11434';
  const ollamaModelSelect = document.getElementById('ollamaModelInput');
  // Try both sidebar and modal help text elements
  const helpText = document.getElementById('ollamaModelHelpSidebar') || document.getElementById('ollamaModelHelpModal');
  const refreshBtn = document.getElementById('refreshOllamaModelsSidebar') || document.getElementById('refreshOllamaModelsModal');
  
  // Store the currently selected value
  const currentValue = ollamaModelSelect.value;
  
  // Show loading state
  ollamaModelSelect.innerHTML = '<option value="">Loading models...</option>';
  ollamaModelSelect.disabled = true;
  if (refreshBtn) refreshBtn.disabled = true;
  
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.models && data.models.length > 0) {
      // Clear and populate dropdown with models
      ollamaModelSelect.innerHTML = '';
      
      data.models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.name;
        option.textContent = model.name;
        ollamaModelSelect.appendChild(option);
      });
      
      // Restore previously selected value if it exists in the list
      if (currentValue && data.models.some(m => m.name === currentValue)) {
        ollamaModelSelect.value = currentValue;
      }
      
      if (helpText) {
        helpText.textContent = `Found ${data.models.length} model(s)`;
        helpText.style.color = '#10b981';
      }
    } else {
      ollamaModelSelect.innerHTML = '<option value="">No models found</option>';
      if (helpText) {
        helpText.textContent = 'No models found. Pull a model using "ollama pull <model-name>"';
        helpText.style.color = '#f59e0b';
      }
    }
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    ollamaModelSelect.innerHTML = '<option value="">Error loading models</option>';
    if (helpText) {
      helpText.textContent = `Error: ${error.message}. Make sure Ollama is running at ${ollamaUrl}`;
      helpText.style.color = '#ef4444';
    }
  } finally {
    ollamaModelSelect.disabled = false;
    if (refreshBtn) refreshBtn.disabled = false;
  }
}

// Fetch available models from LM Studio API
async function fetchLMStudioModelsSidebar() {
  const lmstudioUrl = document.getElementById('lmstudioUrlInput').value || 'http://localhost:1234';
  const lmstudioModelSelect = document.getElementById('lmstudioModelInput');
  const helpText = document.getElementById('lmstudioModelHelpSidebar') || document.getElementById('lmstudioModelHelpModal');
  const refreshBtn = document.getElementById('refreshLMStudioModelsSidebar') || document.getElementById('refreshLMStudioModelsModal');
  
  // Store the currently selected value
  const currentValue = lmstudioModelSelect.value;
  
  // Show loading state
  lmstudioModelSelect.innerHTML = '<option value="">Loading models...</option>';
  lmstudioModelSelect.disabled = true;
  if (refreshBtn) refreshBtn.disabled = true;
  
  try {
    const response = await fetch(`${lmstudioUrl}/v1/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      // Clear and populate dropdown with models
      lmstudioModelSelect.innerHTML = '';
      
      data.data.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.id;
        lmstudioModelSelect.appendChild(option);
      });
      
      // Restore previously selected value if it exists in the list
      if (currentValue && data.data.some(m => m.id === currentValue)) {
        lmstudioModelSelect.value = currentValue;
      }
      
      if (helpText) {
        helpText.textContent = `Found ${data.data.length} loaded model(s) in LM Studio`;
        helpText.style.color = '#10b981';
      }
    } else {
      lmstudioModelSelect.innerHTML = '<option value="local-model">local-model (default)</option>';
      if (helpText) {
        helpText.textContent = 'No models detected. Load a model in LM Studio.';
        helpText.style.color = '#f59e0b';
      }
    }
  } catch (error) {
    console.error('Error fetching LM Studio models:', error);
    lmstudioModelSelect.innerHTML = '<option value="local-model">local-model (default)</option>';
    if (helpText) {
      helpText.textContent = `Error: ${error.message}. Make sure LM Studio server is running at ${lmstudioUrl}`;
      helpText.style.color = '#ef4444';
    }
  } finally {
    lmstudioModelSelect.disabled = false;
    if (refreshBtn) refreshBtn.disabled = false;
  }
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

// Refresh Ollama models button (works for both sidebar and modal)
const refreshOllamaModelsSidebarBtn = document.getElementById('refreshOllamaModelsSidebar');
const refreshOllamaModelsModalBtn = document.getElementById('refreshOllamaModelsModal');
if (refreshOllamaModelsSidebarBtn) {
  refreshOllamaModelsSidebarBtn.addEventListener('click', fetchOllamaModelsSidebar);
}
if (refreshOllamaModelsModalBtn) {
  refreshOllamaModelsModalBtn.addEventListener('click', fetchOllamaModelsSidebar);
}

// Refresh LM Studio models button
const refreshLMStudioModelsSidebarBtn = document.getElementById('refreshLMStudioModelsSidebar');
const refreshLMStudioModelsModalBtn = document.getElementById('refreshLMStudioModelsModal');
if (refreshLMStudioModelsSidebarBtn) {
  refreshLMStudioModelsSidebarBtn.addEventListener('click', fetchLMStudioModelsSidebar);
}
if (refreshLMStudioModelsModalBtn) {
  refreshLMStudioModelsModalBtn.addEventListener('click', fetchLMStudioModelsSidebar);
}

// Fetch models when Ollama URL changes
const ollamaUrlInput = document.getElementById('ollamaUrlInput');
if (ollamaUrlInput) {
  ollamaUrlInput.addEventListener('blur', () => {
    if (serviceSelect.value === 'ollama') {
      fetchOllamaModelsSidebar();
    }
  });
}

// Fetch models when LM Studio URL changes
const lmstudioUrlInput = document.getElementById('lmstudioUrlInput');
if (lmstudioUrlInput) {
  lmstudioUrlInput.addEventListener('blur', () => {
    if (serviceSelect.value === 'lmstudio') {
      fetchLMStudioModelsSidebar();
    }
  });
}

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
    lmstudioUrl: document.getElementById('lmstudioUrlInput').value || 'http://localhost:1234',
    lmstudioModel: document.getElementById('lmstudioModelInput').value || 'local-model',
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
        case 'lmstudio': modelName = newSettings.lmstudioModel; break;
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

// Quick prompts are now loaded dynamically in loadCustomPills()

// Auto-focus input
messageInput.focus();

