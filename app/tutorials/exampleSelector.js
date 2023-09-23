const { SemanticSimilarityExampleSelector, FewShotPromptTemplate, PromptTemplate } = require("langchain/prompts");
const { HNSWLib } = require("langchain/vectorstores/hnswlib");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { OpenAI } = require("langchain/llms/openai");

const exampleSelector = async (req, res) => {

    const llm = new OpenAI({
        modelName: 'gpt-4', 
        openAIApiKey: process.env.key

    });

    // create a prompt template that will be used to format the examples
    const examplePrompt = new PromptTemplate({
        inputVariables: ["input", "output"],
        template: "Input: {input}\nOutput: {output}"
    });


    //Examples of locations that nouns are found
    const examples = [
        {"input": "Camera", "output": "Phone"},
        {"input": "Car", "output": "Garage"},
        {"input": "Sneaker", "output": "Closet"},
        {"input": "Book", "output": "Shelf"},

    ]


    // Create a SemanticSimilarityExampleSelector that will be used to select the examples
    const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
        examples,
        new OpenAIEmbeddings({ openAIApiKey: process.env.key, }),
        HNSWLib,
        { k: 1}
    );


    //create a FewShortPromptTemplate that will use the exampleSelector
    const dynamicPrompt = new FewShotPromptTemplate({
        exampleSelector,
        examplePrompt,
        prefix: "Give me the location an item is usually found in",
        suffix: "Input: {noun}\nOutput: ",
        inputVariables: ["noun"]
    });



    //input 
    const noun = await dynamicPrompt.format({ noun: "sock"});
    console.log(`prefix: `, noun);

    //Call the LLM with the formatted prompt
    const call = await llm.call(noun);

    console.log(`Output: `, call);

    res.status(200).json({ output: call });


}

module.exports = exampleSelector;