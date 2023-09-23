const { ChatOpenAI } = require("langchain/chat_models/openai");
const { HumanChatMessage, SystemChatMessage } = require("langchain/schema");


const chatModel = async (req, res) => {

    const chat = new ChatOpenAI({
        temperature: 0.7, 
        openAIApiKey: process.env.key
    });

    const call = await chat.call([
        new SystemChatMessage("You are a fitness AI bot that suggests exercises based on my goals (in a short sentence)"),
        new HumanChatMessage("I want to improve my core strength. What exercises should I do?")
    ]);

    res.status(200).json({ message: call})


}

module.exports = chatModel;

