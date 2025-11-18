// Popup script to handle menu actions

document.addEventListener('DOMContentLoaded', function() {
    // Handle toggle sidebar button
    const toggleSidebarButton = document.getElementById('toggleSidebar');
    if (toggleSidebarButton) {
        toggleSidebarButton.addEventListener('click', function() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs[0]) {
                    console.log('Sending toggleSidebar message from popup');
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar' }, function(response) {
                        const lastError = chrome.runtime.lastError;
                        if (lastError) {
                            console.error('Error sending message:', lastError.message);
                        } else if (response) {
                            console.log('Toggle response:', response);
                        }
                        window.close(); // Close the popup after action
                    });
                }
            });
        });
    }

    // Handle settings link
    const settingsLink = document.getElementById('settingsLink');
    if (settingsLink) {
        settingsLink.addEventListener('click', function() {
            chrome.runtime.openOptionsPage();
            window.close(); // Close the popup after action
        });
    }
});
