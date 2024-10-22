const tesseract = require('node-tesseract-ocr');
const fs = require('fs');
const path = require('path');
const { fromPath } = require('pdf2pic');

async function convertPDFtoPNG(pdfPath, outputDir) {
  const options = {
    quality: 100,
    density: 100,
    saveFilename: "untitled",
    savePath: outputDir||"./uploads/images/",
    format: "png",
    preserveAspectRatio: true,
  };  
  const pdf2pic = fromPath(pdfPath, options);
  console.log(pdf2pic);
  return pdf2pic.bulk(-1);
}


async function performOCR(pngFilePath) {
  console.log(pngFilePath);
  try {
    // Ensure that pngFilePath is a Buffer or a path to a PNG file
    const pngContent = fs.readFileSync(pngFilePath);

    // Extract text from PNG using Tesseract OCR
    const ocrResult = await tesseract.recognize(pngContent, {
      lang: 'eng', // Specify language code as needed
      oem: 1, // Specify OCR Engine Mode (1 for LSTM)
      psm: 3,
    });

    // Optionally, save the OCR result to a text file
    const textFilePath = path.join(__dirname, 'ocr_output.txt');
    fs.writeFileSync(textFilePath, ocrResult, 'utf-8');
    console.log('OCR result saved to:', textFilePath);

    return ocrResult;
  } catch (error) {
    console.error('Error performing OCR:', error.message);
    throw error;
  }
}


module.exports = { convertPDFtoPNG, performOCR };
