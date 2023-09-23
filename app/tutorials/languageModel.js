const { OpenAI } = require("langchain/llms/openai");

const languageModel = async (req, res) => {
    const llm = new OpenAI({
        modelName: 'gpt-4',
        openAIApiKey: process.env.key

    });

    const call = await llm.call("A song which is performed without music is generally called what, in a short sentence?");

    console.log("Language Model Response: ", call);

    res.status(200).json({ message: call});
}

module.exports = languageModel;