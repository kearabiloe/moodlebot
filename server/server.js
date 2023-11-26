const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { interactWithGPT } = require('./chatgpt');
const { sendWhatsapp } = require('./messageHelper');
const { getQuestions } = require('./extractor');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); 

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json());

// Set up Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/extract', upload.single('file'), async (req, res) => {
    // Set Access-Control-Allow-Origin to allow all origins (not recommended for production)
    res.setHeader('Access-Control-Allow-Origin', '*');    

    try {
        let message = {};
        const fileContent = req.file.buffer.toString('utf-8');
        const prompt = getQuestions(fileContent);
        console.log('Received content from extension:', prompt);

        let answer = '';
        const response = await interactWithGPT(prompt)
        .then(resp => { 
            answer = resp.message.content;
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
          
          params.answer = params.answer.replaceAll('\n','\\n ')

            message = sendWhatsapp(msisdn, params);
            res.json(params);
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

