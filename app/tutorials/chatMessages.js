const { ChatOpenAI } = require("langchain/chat_models/openai");
const { HumanChatMessage, SystemChatMessage } = require("langchain/schema");

const chatMessages = async (req, res ) => {

    const chat = new ChatOpenAI({
        temperature: 0.7,
        openAIApiKey: process.env.key
    });

    const call = await chat.call([
        new SystemChatMessage("You are a nice AI bot that helps a user figure out what to eat based on time of day, in a short sentence"),
        new HumanChatMessage("It's 1pm, what should I eat?")
    ]);

    console.log(`ai_response: ` + `${call.text}`);

    res.status(200).json({ aiChatMessage: call });

}

module.exports = chatMessages;