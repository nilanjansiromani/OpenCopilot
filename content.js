// Content script that injects the sidebar into the page

// Debug logging
console.log('OpenCopilot content script loaded on:', window.location.href);

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
    right: '-100%', // Use percentage instead of vw to ensure it's fully off-screen
    width: '30vw',
    minWidth: '450px',
    maxWidth: '600px', // Add max width to prevent issues on large screens
    height: '100vh',
    border: 'none',
    zIndex: '999999',
    boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.3), -2px 0 8px rgba(0, 0, 0, 0.2)',
    transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
    background: 'white',
    opacity: '0', // Start with opacity 0
    visibility: 'hidden' // Use visibility to ensure it's completely hidden
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
  console.log('Toggling sidebar, new state:', sidebarVisible ? 'visible' : 'hidden');
  
  if (sidebarVisible) {
    // Make visible first to start transition
    sidebarIframe.style.visibility = 'visible';
    
    // Small delay to ensure visibility change is applied before animations
    setTimeout(() => {
      sidebarIframe.style.right = '0';
      sidebarIframe.style.opacity = '1';
      
      // Send updated page content when opening
      const pageContent = extractPageContent();
      sidebarIframe.contentWindow.postMessage({
        type: 'PAGE_CONTENT',
        content: pageContent
      }, '*');
    }, 10);
  } else {
    // Hide by moving off-screen and fading out
    sidebarIframe.style.right = '-100%';
    sidebarIframe.style.opacity = '0';
    
    // Set visibility to hidden after transition completes
    setTimeout(() => {
      if (!sidebarVisible) { // Double-check it's still supposed to be hidden
        sidebarIframe.style.visibility = 'hidden';
      }
    }, 300);
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  
  if (request.action === 'toggleSidebar') {
    console.log('Toggling sidebar visibility');
    toggleSidebar();
    sendResponse({ success: true, visible: sidebarVisible });
  }
  else if (request.action === 'toggleModal') {
    console.log('Toggling modal visibility');
    toggleModal();
    sendResponse({ success: true, visible: modalVisible });
  }
  
  return true; // Important: indicates we'll send a response asynchronously
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
    visibility: 'hidden', // Use visibility instead of display for better transitions
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
  console.log('Toggling modal, new state:', modalVisible ? 'visible' : 'hidden');
  
  if (modalVisible) {
    // Make visible first
    modalIframe.style.visibility = 'visible';
    
    // Small delay to ensure visibility change is applied before animations
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
    // Hide by fading out
    modalIframe.style.opacity = '0';
    
    // Set visibility to hidden after transition completes
    setTimeout(() => {
      if (!modalVisible) { // Double-check it's still supposed to be hidden
        modalIframe.style.visibility = 'hidden';
      }
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

// Add direct keyboard shortcut listener for Arc browser compatibility
document.addEventListener('keydown', (event) => {
  // Check for Ctrl+Shift+O or Command+Shift+O
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'O') {
    console.log('Keyboard shortcut detected directly in content script');
    event.preventDefault(); // Prevent default browser behavior
    
    // Show modal instead of sidebar as requested
    toggleModal();
  }
});

// Create floating pill button
function createFloatingPill() {
  console.log('Creating floating pill button');
  
  // Remove existing pill if any
  const existingPill = document.getElementById('opencopilot-floating-pill');
  if (existingPill) {
    existingPill.remove();
  }
  
  // Create new pill
  const pill = document.createElement('div');
  pill.id = 'opencopilot-floating-pill';
  
  // Set inner HTML
  pill.innerHTML = `
    <div class="pill-icon">⚡</div>
    <div class="pill-text">OpenCopilot</div>
  `;
  
  // Style the pill - using important to override any page styles
  pill.style.cssText = `
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    display: flex !important;
    align-items: center !important;
    padding: 10px 18px !important;
    border-radius: 24px !important;
    background: linear-gradient(135deg, #051020 0%, #0a2540 100%) !important;
    color: white !important;
    font-family: "Lato", sans-serif !important;
    font-size: 14px !important;
    font-weight: bold !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
    cursor: pointer !important;
    z-index: 2147483647 !important; /* Highest possible z-index */
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    user-select: none !important;
  `;
  
  // Style the icon
  const pillIcon = pill.querySelector('.pill-icon');
  pillIcon.style.cssText = `
    margin-right: 8px !important;
    font-size: 16px !important;
  `;
  
  // Add hover effect
  pill.addEventListener('mouseenter', () => {
    pill.style.transform = 'translateY(-2px)';
    pill.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)';
  });
  
  pill.addEventListener('mouseleave', () => {
    pill.style.transform = 'translateY(0)';
    pill.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)';
  });
  
  // Add click event
  pill.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Floating pill clicked, toggling sidebar');
    toggleSidebar();
  });
  
  // Add to the body
  document.body.appendChild(pill);
  console.log('Floating pill created and added to page');
  
  return pill;
}

// Create both sidebar and modal on load (hidden)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    createSidebar();
    createModal();
    createFloatingPill();
  });
} else {
  createSidebar();
  createModal();
  createFloatingPill();
}
