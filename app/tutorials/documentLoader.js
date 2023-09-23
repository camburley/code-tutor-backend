const { PDFLoader } = require("langchain/document_loaders/fs/pdf");

const documentLoader = async (req, res) => {

    const loader = new PDFLoader("/Users/cam/Documents/code-tutor-backend/app/content/Think-And-Grow-Rich_2011-06.pdf");

    const doc = await loader.load();

    console.log(`found ${doc.length} pages in the document`);
    console.log(`Here's a sample: \n\n ${doc[19].pageContent} pages in the document`);

    res.status(200).json({ sample: doc[37].pageContent });
    

}

module.exports = documentLoader;