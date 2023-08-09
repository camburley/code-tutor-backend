
const expressSSE = require("express-sse");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { CallbackManager } = require("langchain/callbacks");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");


const formatMessages = require("../langchain/langchainFormat");
const userUnderstanding = require("../prompts/userUnderstanding");
const instructions = require("../context/instructions");
const breakpoint = require("../context/breakpoint");
const banter = require("../context/banter");

require('dotenv').config();

const assistantCompletion = async (u, a, llm, userMessage, req, res) => {
    const key = process.env.key 
    const chatModel = llm === 35 ? 'gpt-3.5-turbo' : 'gpt-4';
    const sse = new expressSSE();

    try {
        const userList = JSON.parse( u || "[]");
        const assistantList = JSON.parse( a || "[]");

        const prompts = [
            { name: 'instructions', description: 'The user may be confused about how to interact with you. The user is inquiring about you.', template: userUnderstanding(userList, instructions)},
            { name: 'breakpoint', description: 'The user wants to debug or better understand code in breakpoint.js file. ', template: userUnderstanding(userList, breakpoint)},
            { name: 'banter', description: 'The user is clearly engaging in lighthearted banter. ', template: userUnderstanding(userList, banter)},
        ]

        // First, classify the user message

        const classificationModel = new ChatOpenAI({ modelName: chatModel, openAIApiKey: key, verbose: true, streaming: true, temperature: 1 });
        const classificationPromptTemplate = PromptTemplate.fromTemplate("Classify the following user input: {chatHistory} {user_input}. Is this most closely related to : 1. Instructions 2. Breakpoint 3. Banter . Respond with a one word answer, which topic the most recent message most aligns with. Do not use punctuation. ");
        const classificationChain = new LLMChain({ llm: classificationModel, prompt: classificationPromptTemplate});

        const classificationResult = await classificationChain.call({ chatHistory: JSON.stringify(userList), user_input: userMessage }).catch((e) => console.error(e));
        console.log("classificationResult", classificationResult);

        const selectedPrompt = prompts.find( prompt => prompt.name.trim().toLowerCase() === classificationResult.text.trim().toLowerCase() );
        console.log("selectedPrompt", selectedPrompt);

        const model = new ChatOpenAI({ modelName: chatModel, openAIApiKey: key, streaming: true, verbose: true,
        callbackManager: CallbackManager.fromHandlers({
            handleLLMNewToken: async (token) => {
                console.log(token);
                sse.updateInit(token);
                res.write(`data: ${JSON.stringify(token)}\n\n`)
            },
            handleLLMEnd: async (token) => {
                sse.send("🤖", null); // or another event type that the client can use to detect the end of the data
                res.end();
            },
            handleLLMError: async (e) => {
                sse.send("error", emessage);
                res.end();
            }
        }),
        });
        
        const formatted = formatMessages(userList, assistantList, selectedPrompt.template, userMessage);

        sse.init(req, res); // This should set headers and keep connection open

        model.call(formatted).catch((e) => {
            console.error(e);
            if(!res.headersSent) {
                sse.send("error", e.message)
                res.end();
            }
        });


    } catch (error) {
        console.error(error);
        if(!res.headersSent) {
            sse.send("error", error.message)
            res.end();
        }

    }
    
}

module.exports = assistantCompletion;