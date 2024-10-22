// chatgpt.js

require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY || 'sk-svcacct-o7H9YfQLnY-Oo-p1LWZkERSMrO2l5A7y2benKTrQKETtm62KEwm10JCGx-_LEifT3BlbkFJCtK1FrNtQ-WCSSApj-xioVr9UsW_lpn6FOgZrDt-feWfNkM2LJdwr1ymTh-bJKAA'; 
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
        model: "gpt-4o",
        messages: [
            {
                "role": "user",
                "content": `Identify academic questions in this document and give answers ${JSON.stringify(prompt)}`
                // "content": `Identify academic questions in this document and give answers for one question at a time.? `
            }
        ],
        temperature: 0.7, // A slightly lower temperature for more focused responses
        max_tokens: 500,  // Set a reasonable limit for answers based on your needs
        top_p: 0.9,       // Use top-p sampling to enhance diversity while maintaining coherence
        frequency_penalty: 0.5, // Encourage varied responses by slightly penalizing frequent phrases
        presence_penalty: 0.5,   // Increase the likelihood of introducing new topics

    };

console.log(requestBody);
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
