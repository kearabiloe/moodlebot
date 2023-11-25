require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY || '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'; 
const apiUrl = 'https://api.openai.com/v1/chat/completions';

test_data = {
  id: '1',
  title: 'Question 1',
  question: 'What is ChatGPT?',
  answers: [
    'a.\nA messaging app',
    'b.\nA social media platform',
    'c.\nA gaming console',
    'd.\nA virtual assistant'
  ]
};

async function interactWithGPT(prompt=test_data) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "user",
                "content": `What is the correct choice? ${JSON.stringify(prompt)}`
            }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        // return data.choices[0].text.trim();
        return data.choices[0];
    } catch (error) {
        console.error('Error interacting with GPT:', error.message);
        return null;
    }
}

module.exports = { interactWithGPT };
