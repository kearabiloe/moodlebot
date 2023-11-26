chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'extract_content') {
        const pageContent = document.documentElement.outerHTML;
        const file = new Blob([pageContent], { type: 'text/html' });

        // Create a FormData object and append the file
        const formData = new FormData();
        formData.append('file', file, 'pageContent.html');

        // Send content to the server
        // const url = 'http://localhost:3000/extract';
        const url = 'https://moodlebot.crowdcoin.co.za/extract';
        fetch(url, {
            method: 'POST',
            body: formData,
            mode: 'no-cors',
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
