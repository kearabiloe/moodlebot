// popup.js
document.getElementById('sendContent').addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'get_content' });
  });
});

function updateFields() {
    // Add your logic here to update fields
    const serialNumber = document.getElementById('serialNumber').value;
    const cellNumber = document.getElementById('cellNumber').value;
    const autoCapture = document.getElementById('autoCapture').checked;

    // Add your logic to update the fields as needed
    console.log('Serial Number:', serialNumber);
    console.log('Cell Phone Number:', cellNumber);
    console.log('Auto Capture Mode:', autoCapture);
}


function generateRandomKey() {
    const keyLength = 12;
    const minDigit = 100000000000; // Minimum 8-digit number
    const maxDigit = 999999999999; // Maximum 8-digit number

    const randomKey = Math.floor(Math.random() * (maxDigit - minDigit + 1)) + minDigit;

    // Ensure that the generated key is exactly 8 digits
    return String(randomKey).substring(0, keyLength);
}

function assignRandomKey() {
    const randomKey = generateRandomKey();

    // Format the key into groups of 2 digits separated by "-"
    const formattedKey = String(randomKey)
      .split('')
      .map((digit, index) => (index % 4 === 0 && index > 0) ? `-${digit}` : digit)
      .join('');

    console.log('Random Key:', randomKey);
    document.getElementById('serialNumber').value = `${formattedKey}`;


  const phoneNumber = '27787025013';
  const command = `moodlebot://${randomKey}`; 

  const whatsappLink = createWhatsAppLink(phoneNumber, command);
  // Generate QR code with the URL
  generateQRCode(whatsappLink);    

  document.getElementById('whatsappCommand').textContent = command;
  document.getElementById('whatsappNumber').textContent = phoneNumber;

}

function createWhatsAppLink(phoneNumber, message) {
    // Format the phone number (remove non-numeric characters)
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');

    // URL encode the message
    const encodedMessage = encodeURIComponent(message);

    // Create the WhatsApp link
    const whatsappLink = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;

    return whatsappLink;
}

function generateQRCode(url) {
    const qr = new QRious({
        element: document.getElementById('qrcode'),
        value: url,
        size: 200,
    });
}

// popup.js


document.getElementById('uploadPdf').addEventListener('click', function () {
    // Trigger file input click
    document.getElementById('fileInput').click();
    console.log("uploading pdf..");
});

// Listen for file input change event
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    console.log("File input pdf..");
    
    if (file) {
        // Process the selected file (e.g., send it to the content script)
        processSelectedFile(file);
    } else {
        console.error('No file selected.');
    }
});

function processSelectedFile(file) {
    // You can perform additional logic here, e.g., send the file to the content script
    console.log('Selected file:', file);

    // Now you can send the file to your content script or perform other actions
    uploadPdfToServer(file);
}



function uploadPdfToServer(pdf_file) {
    const formData = new FormData();
    formData.append('file', pdf_file, 'document.pdf');

    // Add any additional form data, such as the URL (if needed)
    // formData.append('url', pdfUrl);

    const url = 'http://localhost:3000/extract-pdf';
    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
    })
    .catch(error => {
        console.error('Error sending content to the server:', error);
    });
}



// Check if the DOM has fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Assign random key when the DOM has loaded
    assignRandomKey();
});
