chrome.commands.onCommand.addListener(function (command) {
    if (command === "Extract") {
        console.log("Extracting content command received.");
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs[0]) {
                console.log("Calling extract_content");
                chrome.tabs.sendMessage(tabs[0].id, { action: 'extract_content' });
            } else {
                console.error("No active tab found for extraction.");
            }
        });
    }

    if (command === "SavePDF") {
        console.log("Save PDF command received.");
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs[0]) {
                console.log("Calling get_current_url");
                chrome.tabs.sendMessage(tabs[0].id, { action: 'get_current_url' }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.error("Error in get_current_url:", chrome.runtime.lastError.message);
                    } else {
                        console.log("Received current URL:", response);
                    }
                });
            } else {
                console.error("No active tab found for saving PDF.");
            }
        });
    }
});
