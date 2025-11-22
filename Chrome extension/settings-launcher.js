// This script handles opening the settings page from the extension icon context menu

document.addEventListener('DOMContentLoaded', function() {
    const settingsLink = document.getElementById('settingsLink');
  
    if (settingsLink) {
        settingsLink.addEventListener('click', function() {
            chrome.runtime.openOptionsPage();
        });
    }
});
