
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const { interactWithGPT } = require('./chatgpt'); // Adjust the path accordingly
const { sendWhatsapp } = require("./messageHelper");
const { getQuestions } = require('./extractor');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json());

const allowedOrigins = [
    'http://*.unisa.ac.za',
    'http://*.crowdcoin.co.za',
    'http://localhost',
    'http://127.0.0.1',
    'https://*.unisa.ac.za',
    'https://*.crowdcoin.co.za',
    'https://localhost',
    'https://127.0.0.1',
];

app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// app.post('/extract', (req, res) => {
//     const content = req.body.content;
//     console.log('Received content from extension:', content);

//     // Process content as needed
//     // For simplicity, just send back a success message
//     res.json({ message: 'Content received successfully.' });
// });

// Define route for the "/" URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/extract', async (req, res) => {
    // Set Access-Control-Allow-Origin to allow all origins (not recommended for production)
    res.setHeader('Access-Control-Allow-Origin', '*');    
    const prompt = getQuestions(req.body.content);
    console.log('Received content from extension:', prompt);
    // data = getQuestions(prompt);
    try {
        let answer = '';
        const response = await interactWithGPT(prompt)
        .then(resp=>{ 
            answer=resp.message.content;
            msisdn = process.env.RECIPIENT_WAID;
            title = prompt.title;
            id = prompt.id;
            balance = 0;

            params = {
                'number': id,
                'title': title,
                'answer': answer,
                'balance': balance,
                'whatsapp': msisdn
            };

            // console.log(params);
            message = sendWhatsapp(msisdn, params);
            res.json(message);
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/moodlebot.crx', (req, res) => {
  const crxFilePath = path.join(__dirname, '../extension.crx');

  // Set appropriate headers
  res.setHeader('Content-Type', 'application/x-chrome-extension');
  // Set Access-Control-Allow-Origin to allow all origins (not recommended for production)
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Serve the signed .crx file
  const crxFile = fs.readFileSync(crxFilePath);
  res.end(crxFile);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


module.exports = { sendWhatsapp };
