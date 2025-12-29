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
  
  // Get reference to the pill button
  const pill = document.getElementById('opencopilot-floating-pill');
  
  if (sidebarVisible) {
    // Make visible first to start transition
    sidebarIframe.style.visibility = 'visible';
    
    // Hide the pill button when sidebar is open
    if (pill) {
      pill.style.opacity = '0';
      pill.style.visibility = 'hidden';
      pill.style.pointerEvents = 'none';
    }
    
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
      
      // Focus the input after sidebar is visible
      setTimeout(() => {
        sidebarIframe.contentWindow.postMessage({
          type: 'FOCUS_INPUT'
        }, '*');
      }, 300);
    }, 10);
  } else {
    // Hide by moving off-screen and fading out
    sidebarIframe.style.right = '-100%';
    sidebarIframe.style.opacity = '0';
    
    // Show the pill button when sidebar is closed
    if (pill) {
      pill.style.opacity = '1';
      pill.style.visibility = 'visible';
      pill.style.pointerEvents = 'auto';
    }
    
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
  
  if (request.action === 'ping') {
    // Respond to ping to confirm content script is loaded
    sendResponse({ success: true, loaded: true });
  }
  else if (request.action === 'toggleSidebar') {
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
  
  // Get reference to the pill button
  const pill = document.getElementById('opencopilot-floating-pill');
  
  if (modalVisible) {
    // Make visible first
    modalIframe.style.visibility = 'visible';
    
    // Hide the pill button when modal is open
    if (pill) {
      pill.style.opacity = '0';
      pill.style.visibility = 'hidden';
      pill.style.pointerEvents = 'none';
    }
    
    // Small delay to ensure visibility change is applied before animations
    setTimeout(() => {
      modalIframe.style.opacity = '1';
      
      // Focus the input after modal is visible
      setTimeout(() => {
        modalIframe.contentWindow.postMessage({
          type: 'FOCUS_INPUT'
        }, '*');
      }, 300);
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
    
    // Show the pill button when modal is closed
    if (pill && !sidebarVisible) {
      // Only show pill if sidebar is also closed
      pill.style.opacity = '1';
      pill.style.visibility = 'visible';
      pill.style.pointerEvents = 'auto';
    }
    
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

// Keyboard shortcut for opening modal (Ctrl+Shift+O / Cmd+Shift+O)
// This provides a fallback for Arc browser and ensures consistent behavior
document.addEventListener('keydown', (event) => {
  // Check for Ctrl+Shift+O or Command+Shift+O
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'O') {
    console.log('Keyboard shortcut detected directly in content script');
    event.preventDefault(); // Prevent default browser behavior
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
  
  // Set inner HTML with SVG icon
  pill.innerHTML = `
    <div class="pill-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 22L12.5 16H8L13 2L11.5 8H16L11 22Z"/>
      </svg>
    </div>
    <div class="pill-text">OpenCopilot</div>
  `;
  
  // Load saved position or use defaults
  const savedPosition = localStorage.getItem('opencopilot-pill-position');
  let initialBottom = '20px';
  let initialRight = '20px';
  let initialTop = 'auto';
  let initialLeft = 'auto';
  
  if (savedPosition) {
    try {
      const pos = JSON.parse(savedPosition);
      // Validate saved position is still within viewport
      if (pos.top !== undefined && pos.left !== undefined) {
        const maxTop = window.innerHeight - 50;
        const maxLeft = window.innerWidth - 150;
        initialTop = Math.min(Math.max(0, pos.top), maxTop) + 'px';
        initialLeft = Math.min(Math.max(0, pos.left), maxLeft) + 'px';
        initialBottom = 'auto';
        initialRight = 'auto';
      }
    } catch (e) {
      console.log('Failed to parse saved pill position');
    }
  }
  
  // Style the pill - using important to override any page styles
  pill.style.cssText = `
    position: fixed !important;
    top: ${initialTop} !important;
    left: ${initialLeft} !important;
    bottom: ${initialBottom} !important;
    right: ${initialRight} !important;
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
    cursor: grab !important;
    z-index: 2147483647 !important; /* Highest possible z-index */
    transition: box-shadow 0.2s ease, opacity 0.3s ease, visibility 0.3s ease !important;
    user-select: none !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
  `;
  
  // Style the icon
  const pillIcon = pill.querySelector('.pill-icon');
  pillIcon.style.cssText = `
    margin-right: 8px !important;
    display: flex !important;
    align-items: center !important;
  `;
  
  // Drag state variables
  let isDragging = false;
  let hasDragged = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let pillStartX = 0;
  let pillStartY = 0;
  
  // Add hover effect
  pill.addEventListener('mouseenter', () => {
    if (!isDragging) {
      pill.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)';
    }
  });
  
  pill.addEventListener('mouseleave', () => {
    if (!isDragging) {
      pill.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)';
    }
  });
  
  // Drag functionality
  pill.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    hasDragged = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    
    // Get current pill position
    const rect = pill.getBoundingClientRect();
    pillStartX = rect.left;
    pillStartY = rect.top;
    
    pill.style.cursor = 'grabbing';
    pill.style.transition = 'box-shadow 0.2s ease, opacity 0.3s ease, visibility 0.3s ease';
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  
  function onMouseMove(e) {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    
    // Consider it a drag if moved more than 5 pixels
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDragged = true;
    }
    
    // Calculate new position
    let newLeft = pillStartX + deltaX;
    let newTop = pillStartY + deltaY;
    
    // Constrain to viewport
    const pillRect = pill.getBoundingClientRect();
    const maxLeft = window.innerWidth - pillRect.width;
    const maxTop = window.innerHeight - pillRect.height;
    
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));
    
    // Update position using top/left instead of bottom/right
    pill.style.top = newTop + 'px';
    pill.style.left = newLeft + 'px';
    pill.style.bottom = 'auto';
    pill.style.right = 'auto';
  }
  
  function onMouseUp(e) {
    if (!isDragging) return;
    
    isDragging = false;
    pill.style.cursor = 'grab';
    
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    
    // Save position to localStorage
    const rect = pill.getBoundingClientRect();
    localStorage.setItem('opencopilot-pill-position', JSON.stringify({
      top: rect.top,
      left: rect.left
    }));
    
    // If it was just a click (no significant drag), toggle sidebar
    if (!hasDragged) {
      console.log('Floating pill clicked, toggling sidebar');
      toggleSidebar();
    }
  }
  
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
