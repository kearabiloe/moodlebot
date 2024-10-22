chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'extract_content') {
        console.log("Extracting content...");

        // Retrieve the cell number from environment (you may need to adjust this based on your setup)
        const cellNo ='0787025013'; // Replace with actual logic to retrieve cell number
        const sessionId = getSessionId();  // Example function to get session ID
        const timestamp = Date.now();      // Get the current timestamp in milliseconds
        const sanitizedURL = document.URL.replace(/[^a-z0-9]/gi, '_');  // Sanitize the URL for filename
        
        // Create a unique filename using session ID, cell number, sanitized URL, and timestamp
        const filename = `${sessionId}_${cellNo}_${sanitizedURL}_${timestamp}.html`;

        // Get the HTML content of the current page
        const pageContent = document.documentElement.outerHTML;
        const file = new Blob([pageContent], { type: document.contentType });

        // Create FormData and append the file with the unique filename
        const formData = new FormData();
        formData.append('file', file, filename);
        formData.append('cellno', cellNo);

        console.log("Sending file to server with filename:", filename);

        // Send content to the server
        const url = 'http://localhost:3000/extract';
        fetch(url, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('Error sending content to server:', error);
        });
    }

    if (request.action === 'get_current_url') {
        const currentUrl = window.location.href;
        console.log("Current URL:", currentUrl);
        sendResponse(currentUrl);
        savePageLocally(currentUrl);
    }

    return true; // Keep the message channel open for asynchronous responses.
});

function savePageLocally(currentUrl) {
    console.log('Saving page locally:', currentUrl);
    if (currentUrl) {
        downloadPdfLocally(currentUrl);
    } else {
        console.error('Unable to get the current URL.');
    }
}

function downloadPdfLocally(pdfUrl) {
    console.log('Downloading PDF from:', pdfUrl);

    fetch(pdfUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const filename = pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1) || 'download.pdf';  // Extract filename from URL
            const url = URL.createObjectURL(blob);

            // Trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);  // Append anchor to body for Firefox compatibility
            a.click();
            document.body.removeChild(a);  // Remove the anchor element
            URL.revokeObjectURL(url);
            console.log('PDF download triggered:', filename);
        })
        .catch(error => {
            console.error('Error downloading PDF:', error);
        });
}

// Example function to generate or retrieve a session ID
function getSessionId() {
    // Replace this logic with actual session ID retrieval, e.g., from cookies, localStorage, or page context
    const sessionId = 'session123'; // Example hardcoded session ID
    return sessionId;
}
