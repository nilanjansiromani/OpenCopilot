// Background service worker for handling keyboard shortcuts and extension lifecycle

// Log when the service worker starts
console.log('OpenCopilot background service worker started');

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  if (command === 'toggle-modal' || command === 'open-modal-alt') {
    // Open AI assistant modal (both shortcuts)
    toggleModalOnActiveTab();
  } else if (command === 'toggle-sidebar') {
    // Open AI assistant sidebar
    toggleSidebarOnActiveTab();
  } else if (command === 'open-settings') {
    // Open settings dashboard
    chrome.runtime.openOptionsPage();
  }
});

// Also toggle sidebar when extension icon is clicked (alternative method for Arc browser)
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked, toggling sidebar');
  toggleSidebarOnActiveTab();
});

// Helper function to check if content script is loaded and inject if needed
async function ensureContentScriptLoaded(tabId, url) {
  // Check if URL is a restricted page where content scripts can't run
  const restrictedProtocols = ['chrome://', 'chrome-extension://', 'edge://', 'about:', 'data:', 'file://'];
  if (restrictedProtocols.some(protocol => url.startsWith(protocol))) {
    console.log('Cannot inject content script on restricted page:', url);
    return false;
  }
  
  try {
    // Try to ping the content script
    const response = await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    console.log('Content script already loaded');
    return true;
  } catch (error) {
    console.log('Content script not loaded, injecting...');
    try {
      // Inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
      
      // Wait a bit for the script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('Content script injected successfully');
      return true;
    } catch (injectError) {
      console.error('Failed to inject content script:', injectError);
      return false;
    }
  }
}

// Helper function to toggle sidebar on active tab
async function toggleSidebarOnActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) {
      console.error('No active tab found');
      return;
    }
    
    const tab = tabs[0];
    console.log('Attempting to toggle sidebar on tab:', tab.id, tab.url);
    
    // Ensure content script is loaded
    const isLoaded = await ensureContentScriptLoaded(tab.id, tab.url);
    if (!isLoaded) {
      console.error('Cannot toggle sidebar: content script not available');
      return;
    }
    
    // Send the toggle message
    chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' }, (response) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        console.error('Error sending toggleSidebar message:', lastError.message);
      } else if (response) {
        console.log('Toggle sidebar response:', response);
      }
    });
  } catch (error) {
    console.error('Error in toggleSidebarOnActiveTab:', error);
  }
}

// Helper function to toggle modal on active tab
async function toggleModalOnActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) {
      console.error('No active tab found');
      return;
    }
    
    const tab = tabs[0];
    console.log('Attempting to toggle modal on tab:', tab.id, tab.url);
    
    // Ensure content script is loaded
    const isLoaded = await ensureContentScriptLoaded(tab.id, tab.url);
    if (!isLoaded) {
      console.error('Cannot toggle modal: content script not available');
      return;
    }
    
    // Send the toggle message
    chrome.tabs.sendMessage(tab.id, { action: 'toggleModal' }, (response) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        console.error('Error sending toggleModal message:', lastError.message);
      } else if (response) {
        console.log('Toggle modal response:', response);
      }
    });
  } catch (error) {
    console.error('Error in toggleModalOnActiveTab:', error);
  }
}

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      settings: {
        service: 'groq',
        groqApiKey: '',
        groqModel: 'openai/gpt-oss-20b',
        geminiApiKey: '',
        geminiModel: 'gemini-2.5-flash-preview-09-2025',
        openRouterApiKey: '',
        openRouterModel: 'z-ai/glm-4.5-air:free',
        ollamaUrl: 'http://localhost:11434',
        ollamaModel: 'granite4:350m',
        lmstudioUrl: 'http://localhost:1234',
        lmstudioModel: 'local-model',
        osaurusUrl: 'http://127.0.0.1:1337',
        osaurusModel: 'foundation'
      }
    });
    
    // Open settings page
    chrome.tabs.create({ url: 'settings.html' });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['settings'], (result) => {
      sendResponse(result.settings || {});
    });
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'saveSettings') {
    chrome.storage.sync.set({ settings: request.settings }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'openSettings') {
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
  }
});
