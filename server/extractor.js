const { JSDOM } = require('jsdom');

function getQuestions(doc_string) {
    console.log(doc_string.slice(0, 50));

    // Create a DOM from the HTML string
    const dom = new JSDOM(doc_string);

    // Access the document
    const document = dom.window.document;

    // Retrieve the entire text content of the page
    const pageText = document.documentElement.textContent || document.body.textContent;

    // Check if any questions or specific elements are found
    const questionNo = Array.from(document.querySelectorAll('.qno')).map(label => label.textContent.trim());
    const questionText = Array.from(document.querySelectorAll('.qtext')).map(label => label.textContent.trim());
    const answerLabels = document.querySelectorAll('div[data-region="answer-label"]');
    const answerTexts = Array.from(answerLabels).map(label => label.textContent.trim());

    let data;
    if (questionNo.length && questionText.length) {
        // If questions are found, return the extracted data
        data = {
            id: questionNo,
            title: `Question ${questionNo}`,
            question: questionText,
            answers: answerTexts
        };
    } else {
        // If no questions are found, return the entire page content as a single text string
        data = {
            title: 'Full Document',
            content: pageText.trim()
        };
    }

    console.log('Extracted Data:', data);
    return data;
}

module.exports = { getQuestions };
