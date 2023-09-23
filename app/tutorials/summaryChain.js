const { loadSummarizationChain } = require("langchain/chains");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { CharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAI } = require("langchain/llms/openai");


const summaryChain = async ( req, res ) => {

    const loader = new PDFLoader("/Users/cam/Documents/code-tutor-backend/app/content/The-Crack-Up-Extract.pdf");

    const doc = await loader.load();

    const splitter = new CharacterTextSplitter({
        separator: "\n",
        chunkSize: 1350,
        chunkOverlap: 10
    });

    const texts = await splitter.splitDocuments(doc);

    const model = new OpenAI({
        temperature: 0, 
        openAIApiKey: process.env.key,
        verbose: true
    });

    const options = { type: "map_reduce"};
    const chain = loadSummarizationChain(model, options);
    const call = await chain.call({ input_documents: texts });

    console.log(`text: `, call);

    res.status(200).json({
        text: call 
    });

}

module.exports = summaryChain;