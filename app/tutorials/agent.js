const { OpenAI } = require("langchain/llms/openai");
const { SerpAPI } = require("langchain/tools");
const { initializeAgentExecutorWithOptions } = require("langchain/agents");

const agent = async (req, res) => {

    const llm = new OpenAI({
        temperature: 0, 
        openAIApiKey: process.env.key
    });

    const tools = [
        new SerpAPI(process.env.SERPAPI_API_KEY, { location: "New York, NY, United States", hl: "en", gl: "us" }),
        // Add more tools here if needed
    ];

    const agent = await initializeAgentExecutorWithOptions(tools, llm, {
        agentType: "zero-shot-react-description",
        verbose: true
    });

    const call = await agent.call({ input: "Who was the creator of the sketch comedy show where JLo woked as a dancer?"});

    console.log(`answer: `, call);

    res.status(200).json({ answer: call });

};

module.exports = agent;