// content.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'extract_content') {

        // const pageContent = document.documentElement.outerHTML;
        const pageContent = document.getElementById('responseform');

        console.log("Sending: ",pageContent);
        // Send content to the server
        fetch('https://moodlebot.crowdcoin.co.za/extract', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: pageContent }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('Error sending content to server:', error);
        });
    }
});
