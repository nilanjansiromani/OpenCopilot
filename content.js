// Content script that injects the sidebar into the page

let sidebarIframe = null;
let modalIframe = null;
let sidebarVisible = false;
let modalVisible = false;

// Function to extract page content
function extractPageContent() {
  // Get the main content of the page
  const body = document.body.cloneNode(true);
  
  // Remove script tags, style tags, and other non-content elements
  const elementsToRemove = body.querySelectorAll('script, style, noscript, iframe, nav, header, footer');
  elementsToRemove.forEach(el => el.remove());
  
  // Get text content
  const textContent = body.innerText || body.textContent;
  
  // Get main HTML content for markdown conversion
  const mainContent = document.querySelector('main') || 
                      document.querySelector('article') || 
                      document.querySelector('.content') ||
                      document.querySelector('#content') ||
                      document.body;
  
  return {
    title: document.title,
    url: window.location.href,
    textContent: textContent.trim(),
    htmlContent: mainContent.innerHTML,
    timestamp: new Date().toISOString()
  };
}

// Function to create and inject the sidebar
function createSidebar() {
  if (sidebarIframe) return;
  
  // Create iframe for sidebar
  sidebarIframe = document.createElement('iframe');
  sidebarIframe.id = 'highlightr-sidebar';
  sidebarIframe.src = chrome.runtime.getURL('sidebar.html');
  
  // Style the iframe
  Object.assign(sidebarIframe.style, {
    position: 'fixed',
    top: '0',
    right: '-30vw',
    width: '30vw',
    minWidth: '450px',
    height: '100vh',
    border: 'none',
    zIndex: '999999',
    boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.3), -2px 0 8px rgba(0, 0, 0, 0.2)',
    transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'white'
  });
  
  document.body.appendChild(sidebarIframe);
  
  // Wait for iframe to load, then send page content
  sidebarIframe.onload = () => {
    const pageContent = extractPageContent();
    sidebarIframe.contentWindow.postMessage({
      type: 'PAGE_CONTENT',
      content: pageContent
    }, '*');
  };
}

// Function to toggle sidebar visibility
function toggleSidebar() {
  if (!sidebarIframe) {
    createSidebar();
  }
  
  sidebarVisible = !sidebarVisible;
  
  if (sidebarVisible) {
    sidebarIframe.style.right = '0';
    
    // Send updated page content when opening
    setTimeout(() => {
      const pageContent = extractPageContent();
      sidebarIframe.contentWindow.postMessage({
        type: 'PAGE_CONTENT',
        content: pageContent
      }, '*');
    }, 300);
  } else {
    sidebarIframe.style.right = '-30vw';
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSidebar') {
    toggleSidebar();
    sendResponse({ success: true });
  }
});

// Function to create modal
function createModal() {
  if (modalIframe) return;
  
  // Create iframe for modal
  modalIframe = document.createElement('iframe');
  modalIframe.id = 'highlightr-modal';
  modalIframe.src = chrome.runtime.getURL('modal.html');
  
  // Style the iframe
  Object.assign(modalIframe.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    border: 'none',
    zIndex: '999998',
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'none',
    opacity: '0',
    transition: 'opacity 0.3s ease-in-out'
  });
  
  document.body.appendChild(modalIframe);
  
  // Wait for iframe to load
  modalIframe.onload = () => {
    const pageContent = extractPageContent();
    modalIframe.contentWindow.postMessage({
      type: 'PAGE_CONTENT',
      content: pageContent
    }, '*');
  };
}

// Toggle modal visibility
function toggleModal() {
  if (!modalIframe) {
    createModal();
  }
  
  modalVisible = !modalVisible;
  
  if (modalVisible) {
    modalIframe.style.display = 'block';
    setTimeout(() => {
      modalIframe.style.opacity = '1';
    }, 10);
    
    // Close sidebar if open
    if (sidebarVisible) {
      toggleSidebar();
    }
    
    // Send page content
    setTimeout(() => {
      const pageContent = extractPageContent();
      modalIframe.contentWindow.postMessage({
        type: 'PAGE_CONTENT',
        content: pageContent
      }, '*');
    }, 100);
  } else {
    modalIframe.style.opacity = '0';
    setTimeout(() => {
      modalIframe.style.display = 'none';
    }, 300);
  }
}

// Listen for messages from sidebar/modal
window.addEventListener('message', (event) => {
  // Only accept messages from our extension
  if (event.source === sidebarIframe?.contentWindow || event.source === modalIframe?.contentWindow) {
    console.log('Message received:', event.data.type);
    
    if (event.data.type === 'CLOSE_SIDEBAR') {
      if (modalVisible) {
        console.log('Closing modal');
        toggleModal();
      } else {
        console.log('Closing sidebar');
        toggleSidebar();
      }
    } else if (event.data.type === 'TOGGLE_MODAL') {
      console.log('Toggling to modal view');
      
      // Get current messages from sidebar before closing
      if (sidebarVisible && event.data.messages) {
        // Store messages temporarily
        window.tempMessages = event.data.messages;
      }
      
      if (sidebarVisible) {
        toggleSidebar(); // Close sidebar
      }
      setTimeout(() => {
        toggleModal(); // Open modal
        
        // Send messages to modal if we have them
        if (window.tempMessages) {
          setTimeout(() => {
            modalIframe.contentWindow.postMessage({
              type: 'SYNC_MESSAGES',
              messages: window.tempMessages
            }, '*');
            window.tempMessages = null;
          }, 100);
        }
      }, sidebarVisible ? 350 : 0);
    } else if (event.data.type === 'GET_PAGE_CONTENT') {
      const pageContent = extractPageContent();
      const target = event.source;
      target.postMessage({
        type: 'PAGE_CONTENT',
        content: pageContent
      }, '*');
    }
  }
});

// Create both sidebar and modal on load (hidden)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    createSidebar();
    createModal();
  });
} else {
  createSidebar();
  createModal();
}
