const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { CharacterTextSplitter } = require("langchain/text_splitter");

const textSplitter = async (req, res) => {

    const loader = new PDFLoader("/Users/cam/Documents/code-tutor-backend/app/content/Think-And-Grow-Rich_2011-06.pdf");

    const doc = await loader.load();

    const splitter = new CharacterTextSplitter({
        separator: "\n", 
        chunkSize: 350,
        chunkOverlap: 10
    });

    const texts = await splitter.createDocuments([doc[19].pageContent]);
    console.log(`texts.length: `, texts.length);


    console.log(`texts: `, texts);

    res.status(200).json({ text: texts});
}

module.exports = textSplitter;