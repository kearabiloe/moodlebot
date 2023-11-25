
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const { interactWithGPT } = require('./chatgpt'); // Adjust the path accordingly
const { sendWhatsapp } = require("./messageHelper");
const { getQuestions } = require('./extractor');

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// app.post('/extract', (req, res) => {
//     const content = req.body.content;
//     console.log('Received content from extension:', content);

//     // Process content as needed
//     // For simplicity, just send back a success message
//     res.json({ message: 'Content received successfully.' });
// });

app.post('/extract', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


module.exports = { sendWhatsapp };
