const { OpenAI } = require("langchain/llms/openai");

const prompt = async (req, res) => {

    const llm = new OpenAI({
        modelName: 'gpt-4',
        openAIApiKey: process.env.key
    });

    const prompt = `
            Young Jeezy is an R&B artist from New York City, NY. 

            What's wrong with that statement?
    `

    const call = await llm.call(prompt);

    console.log("response: ", call);

    res.status(200).json({ answer: call });

}

module.exports = prompt;