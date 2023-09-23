const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");

const promptTemplate = async ( req, res ) => {

    const llm = new OpenAI({
        modelName: 'gpt-4',
        openAIApiKey: process.env.key
    });

    const template = `
        I'm planning on buying {product}. Which should I consider?

        respond in one short sentence.
    `;

    const prompt = new PromptTemplate({
        inputVariables: ["product"],
        template: template,
    });

    const finalPrompt = await prompt.format({
        product: "retro sneakers"
    });

    console.log(`finalPrompt`, finalPrompt);

    const call = await llm.call(finalPrompt);
    console.log(`LLM Output: `, call);

    res.status(200).json({ prompt: finalPrompt, LLM_Output: call });

    
}

module.exports = promptTemplate;