const { JSDOM } = require('jsdom');

function getQuestions(doc_string){

	console.log(doc_string);
	
	// Your HTML string
	const htmlString = doc_string ;

	// Create a DOM from the HTML string
	const dom = new JSDOM(htmlString);

	// Access the document
	const document = dom.window.document;


    // Find the question text
    const questionNo = document.querySelector('.qno').textContent;

    // Find the question text
    const questionText = document.querySelector('.qtext').textContent;

    // Find all answer options
    const answerLabels = document.querySelectorAll('div[data-region="answer-label"]');

    // Extract answer texts
    const answerTexts = Array.from(answerLabels).map(label => label.textContent.trim());

    data = {
        id:questionNo,
        title:`Question ${questionNo}`,
        question:questionText,
        answers:answerTexts
    };

	console.log(data); 

	return data;
}

module.exports = { getQuestions };
