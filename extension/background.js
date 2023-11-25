// background.js

chrome.commands.onCommand.addListener(function (command) {
    if (command === "triggerAction") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'extract_content' });
            }
        });
    }
});
