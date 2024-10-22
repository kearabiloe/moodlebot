// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const { interactWithGPT } = require('./chatgpt');
const { sendWhatsapp } = require('./messageHelper');
const { getQuestions } = require('./extractor');
const { convertPDFtoPNG, performOCR } = require('./tessaocr');

const app = express();
const port = 3000;

// In-memory store for results (this can be replaced with a database)
const resultsStore = {};

// Body parser for JSON with a higher limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Setup CORS (Restrict this in production)
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for extracting content from HTML files
app.post('/extract', upload.single('file'), async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const cellno = req.body.cellno; // Get cellno from the request body
    if (!cellno) {
      throw new Error('Cell number is required');
    }

    const fileContent = req.file.buffer.toString('utf-8');
    // const prompt = fileContent; 
    const prompt = getQuestions(fileContent); 
    console.log('Received content from extension:', prompt);

    // Save the file locally
    const filePath = path.join(__dirname, 'uploads', req.file.originalname || 'uploadedFile.html');
    await fs.writeFile(filePath, fileContent, 'utf-8');
    console.log('File saved locally:', filePath);

    // Interact with GPT
    const gptResponse = await interactWithGPT(prompt);
    console.log('GPT Response:', gptResponse);

    // Store the result in the resultsStore
    resultsStore[cellno] = gptResponse;

    res.json({ message: 'Extraction successful', cellno: cellno });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to fetch results based on cellno
app.get('/results/:cellno/', (req, res) => {
  const cellno = req.params.cellno;
  
  // Retrieve results from the in-memory store
  const results = resultsStore[cellno];
  
  if (!results) {
    return res.status(404).json({ error: 'Results not found for the provided cell number' });
  }

  res.json({ cellno, results });
});


app.post('/extract-pdf', upload.single('file'), async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const fileContent = req.file.buffer;
    const pdfFilePath = path.join(__dirname, 'uploads', req.file.originalname || 'uploadedFile.pdf');
    
    // Save the PDF file locally
    await fs.writeFile(pdfFilePath, fileContent);
    console.log('PDF file saved locally:', pdfFilePath);

    // Convert PDF to PNG images
    const outputDir = path.join(__dirname, 'uploads');
    const pngFiles = await convertPDFtoPNG(pdfFilePath, outputDir);
    console.log('PDF converted to PNG:', pngFiles);

    // Perform OCR on each PNG file
    let ocrResults = [];
    for (const pngFile of pngFiles) {
      console.log('Performing OCR on:', pngFile.path);
      const ocrResult = await performOCR(pngFile.path);
      ocrResults.push(ocrResult);
      console.log('OCR Result:', ocrResult);
    }

    res.json({ message: 'PDF processed successfully', ocrResults });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route to serve the Chrome extension .crx file
app.get('/moodlebot.crx', (req, res) => {
  const crxFilePath = path.join(__dirname, '../extension.crx');

  // Set appropriate headers for the CRX file
  res.setHeader('Content-Type', 'application/x-chrome-extension');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Serve the signed .crx file
  fs.readFile(crxFilePath)
    .then(crxFile => res.end(crxFile))
    .catch(err => {
      console.error('Error serving CRX file:', err.message);
      res.status(500).send('Error serving CRX file');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
