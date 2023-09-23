const { OpenAIEmbeddings } = require("langchain/embeddings/openai");

const textEmbeddingModel = async (req, res ) => {

    const embedding = new OpenAIEmbeddings({
        openAIApiKey: process.env.key

    });

    const text = "I like Tupac and Biggie.";
    const call = await embedding.embedQuery(text);
    
    console.log(`Your embedding is length: ${call.length}`);
    console.log(`Here's a sample: ${call[5]}`);

    res.status(200).json({
        text: text,
        embedding: call
    })

}

module.exports = textEmbeddingModel;