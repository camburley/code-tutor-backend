const { JSONLoader } = require("langchain/document_loaders/fs/json");
const { CharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("langchain/document");
const { PineconeClient } = require("@pinecone-database/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");

require('dotenv').config();

const jsonHandler = async (req, res) => {

    console.log("inside JSON handler");

    const basePath = `/Users/cam/Documents/code-tutor-backend/app/context/json/`;

    const fileNames = [
        'scrollArea', 'chatBox', 'index', 'userChat', 'assistantChat', 'chatWindow',
        'utils', 'breakpoint', 'app', 'card', 'messageInput'

    ];

    try {
        const splitter = new CharacterTextSplitter({
            separator: "\n",
            chunkSize: 1250,
            chunkOverlap: 10
        });

        const client = new PineconeClient();
        await client.init({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_ENVIRONMENT,
        });
        const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

        for ( const fileName of fileNames) {
            const loader = new JSONLoader(basePath + fileName + '.json');
            const docs = await loader.load();
            if(!docs.length) {
                console.log('no docs for ', fileName );
                continue;
            }

            const splitDocs = await splitter.splitDocuments(docs);
            const reducedDocs = splitDocs.map((doc) => {
                const reducedMetaData = {...doc.pageContent };
                delete reducedMetaData.loc;
                return new Document({
                    pageContent: doc.pageContent,
                    metadata: doc.metadata,

                });
            });

            console.log(`reducedDocs[0] for ${fileName}`, reducedDocs[0]);
            console.log(`reducedDocs for ${fileName}`, reducedDocs);
            console.log(`splitDocs.length for ${fileName}`, splitDocs.length);

            await PineconeStore.fromDocuments(reducedDocs, new OpenAIEmbeddings({ openAIApiKey: process.env.key }), { pineconeIndex });

        }

        console.log("successfully uploaded to Pinecone");
        return res.status(200).send({ status: 200, message: 'success' });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: 500, message: 'Internal Server Error'});
    }
}

module.exports = jsonHandler;