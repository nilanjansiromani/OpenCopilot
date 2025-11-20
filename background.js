// Background service worker for handling keyboard shortcuts and extension lifecycle

// Log when the service worker starts
console.log('OpenCopilot background service worker started');

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  if (command === 'toggle-modal') {
    // Open AI assistant modal
    toggleModalOnActiveTab();
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

// Helper function to toggle sidebar on active tab
function toggleSidebarOnActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      console.log('Sending toggleSidebar message to tab:', tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar' }, (response) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          console.error('Error sending message:', lastError.message);
        } else if (response) {
          console.log('Toggle response:', response);
        }
      });
    } else {
      console.error('No active tab found');
    }
  });
}

// Helper function to toggle modal on active tab
function toggleModalOnActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      console.log('Sending toggleModal message to tab:', tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleModal' }, (response) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          console.error('Error sending message:', lastError.message);
        } else if (response) {
          console.log('Toggle response:', response);
        }
      });
    } else {
      console.error('No active tab found');
    }
  });
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
        ollamaModel: 'granite4:350m'
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
