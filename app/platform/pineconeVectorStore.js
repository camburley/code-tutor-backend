const { PineconeClient } = require("@pinecone-database/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");

require('dotenv').config();

const pineconeVectorStore = async (userMessage) => {

    console.log("Pinecone Vector Store!");

    if(!userMessage){
        throw new Error('No userMessage provided');
    }

    console.log("userMessage received ", userMessage);

    try {
        // initialize client for Pinecone
        const client = new PineconeClient();
        await client.init({
            apiKey: process.env.PINECONE_API_KEY, 
            environment: process.env.PINECONE_ENVIRONMENT,

        });

        const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

        // now connect to vector store
        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({
                openAIApiKey: process.env.key
            }), 
            { pineconeIndex }
            
            );

            // now Search!

            const similaritySearch = await vectorStore.similaritySearch(userMessage, 2);
            console.log(`similaritySearch`, similaritySearch);
            let contextArr = [];
            if(similaritySearch.length > 1){
                similaritySearch.forEach((result) => {
                    console.log(`result`, result);
                    const pageContent = result.pageContent;
                    contextArr.push(pageContent);
                })
            } else {
                const pageContent = similaritySearch[0].pageContent;
                contextArr.push(pageContent);

            }

            return contextArr;

    } catch (error) {
        console.error(error);
    }

}

module.exports = pineconeVectorStore;
