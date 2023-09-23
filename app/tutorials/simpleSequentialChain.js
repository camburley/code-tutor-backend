const { SimpleSequentialChain, LLMChain } = require("langchain/chains");
const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");

const simpleSequentialChain = async (req, res) => {

    const llm = new OpenAI({
        temperature: 0, 
        modelName: 'gpt-4',
        openAIApiKey: process.env.key
    });

    const template = `
        When the user mentions a famous person from a country, mention a well-known festival from that place.

        User famous person: {user_person}

        Your response: 
    `;

    const promptTemplate = new PromptTemplate({
        template: template,
        inputVariables: ["user_person"],
    });

    const locationChain = new LLMChain({ llm: llm, prompt: promptTemplate });

    console.log(`locationChain`, locationChain);

    const anotherTemplate = `
    Given a well-known festival from a place, describe the terrain of that location.

    {festival}

    Your response: 
    `;

    const anotherPromptTemplate = new PromptTemplate({
        template: anotherTemplate,
        inputVariables: ["festival"]
    });

    const terrainChain = new LLMChain({ llm: llm, prompt: anotherPromptTemplate });
    const overallChain = new SimpleSequentialChain({ chains: [locationChain, terrainChain], verbose: true});
    const location = await overallChain.run("bob marley");

    res.status(200).json({ message: location });
}

module.exports = simpleSequentialChain;