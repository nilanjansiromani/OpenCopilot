// Background script for Firefox - handling keyboard shortcuts and extension lifecycle
// Firefox compatibility: Use browser API with chrome fallback
const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

// Log when the background script starts
console.log('OpenCopilot background script started (Firefox)');

// Handle keyboard shortcuts
browserAPI.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  if (command === 'toggle-modal' || command === 'open-modal-alt') {
    // Open AI assistant modal (both shortcuts)
    toggleModalOnActiveTab();
  } else if (command === 'toggle-sidebar') {
    // Open AI assistant sidebar
    toggleSidebarOnActiveTab();
  } else if (command === 'open-settings') {
    // Open settings dashboard
    browserAPI.runtime.openOptionsPage();
  }
});

// Also toggle sidebar when extension icon is clicked
browserAPI.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked, toggling sidebar');
  toggleSidebarOnActiveTab();
});

// Helper function to check if content script is loaded and inject if needed
async function ensureContentScriptLoaded(tabId, url) {
  // Check if URL is a restricted page where content scripts can't run
  const restrictedProtocols = ['chrome://', 'chrome-extension://', 'moz-extension://', 'about:', 'data:', 'file://'];
  if (restrictedProtocols.some(protocol => url.startsWith(protocol))) {
    console.log('Cannot inject content script on restricted page:', url);
    return false;
  }
  
  try {
    // Try to ping the content script
    const response = await browserAPI.tabs.sendMessage(tabId, { action: 'ping' });
    console.log('Content script already loaded');
    return true;
  } catch (error) {
    console.log('Content script not loaded, injecting...');
    try {
      // Inject the content script
      await browserAPI.scripting.executeScript({
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
    const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
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
    try {
      const response = await browserAPI.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
      console.log('Toggle sidebar response:', response);
    } catch (error) {
      console.error('Error sending toggleSidebar message:', error.message);
    }
  } catch (error) {
    console.error('Error in toggleSidebarOnActiveTab:', error);
  }
}

// Helper function to toggle modal on active tab
async function toggleModalOnActiveTab() {
  try {
    const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
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
    try {
      const response = await browserAPI.tabs.sendMessage(tab.id, { action: 'toggleModal' });
      console.log('Toggle modal response:', response);
    } catch (error) {
      console.error('Error sending toggleModal message:', error.message);
    }
  } catch (error) {
    console.error('Error in toggleModalOnActiveTab:', error);
  }
}

// Handle installation
browserAPI.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    browserAPI.storage.sync.set({
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
        lmstudioModel: 'local-model'
      }
    });
    
    // Open settings page
    browserAPI.tabs.create({ url: 'settings.html' });
  }
});

// Handle messages from content scripts
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    browserAPI.storage.sync.get(['settings']).then((result) => {
      sendResponse(result.settings || {});
    });
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'saveSettings') {
    browserAPI.storage.sync.set({ settings: request.settings }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'openSettings') {
    browserAPI.runtime.openOptionsPage();
    sendResponse({ success: true });
  }
});
