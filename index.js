const express = require('express');
const path = require('path')
const app = express();
const http = require('http');
const server = http.createServer(app);
const axios = require('axios').default;
const bodyParser = require('body-parser');
const cors = require('cors');
const assistantCompletion = require('./app/platform/assistant');
const jsonHandler = require('./app/platform/jsonHandler');
const pineconeVectorStore = require('./app/platform/pineconeVectorStore');
const simpleTrainedChats = require('./app/platform/simpleTrainedChat');
const chatMessages = require('./app/tutorials/chatMessages');
const document = require('./app/tutorials/document');
const languageModel = require('./app/tutorials/languageModel');
const chatModel = require('./app/tutorials/chatModel');
const textEmbeddingModel = require('./app/tutorials/textEmbeddingModel');
const prompt = require('./app/tutorials/prompt');
const promptTemplate = require('./app/tutorials/promptTemplate');
const exampleSelector = require('./app/tutorials/exampleSelector');
const documentLoader = require('./app/tutorials/documentLoader');
const textSplitter = require('./app/tutorials/textSplitter');
const simpleSequentialChain = require('./app/tutorials/simpleSequentialChain');
const summaryChain = require('./app/tutorials/summaryChain');
const agent = require('./app/tutorials/agent');


// require('dotenv').config({ path: path.resolve(__dirname, './config/dev.env') });
require('dotenv').config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(function (err, req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if(err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ status: 404, message: err.message });

    }
    next();


});

app.use(cors({ origin: '*' }));


// tutorials

app.get(`/api/v1/assistant/chatMessages`, async ( req, res ) => {
    await chatMessages(req, res);
});

app.get(`/api/v1/assistant/doc`, async ( req, res ) => {
    await document(req, res);
});

app.get(`/api/v1/assistant/languageModel`, async ( req, res ) => {
    await languageModel(req, res);
});

app.get(`/api/v1/assistant/chatModel`, async ( req, res ) => {
    await chatModel(req, res);
});

app.get(`/api/v1/assistant/textEmbed`, async ( req, res ) => {
    await textEmbeddingModel(req, res);
});

app.get(`/api/v1/assistant/prompt`, async ( req, res ) => {
    await prompt(req, res);
});

app.get(`/api/v1/assistant/promptTemplate`, async ( req, res ) => {
    await promptTemplate(req, res);
});

app.get(`/api/v1/assistant/exampleSelector`, async ( req, res ) => {
    await exampleSelector(req, res);
});

app.get(`/api/v1/assistant/docLoader`, async ( req, res ) => {
    await documentLoader(req, res);
});

app.get(`/api/v1/assistant/textSplitter`, async ( req, res ) => {
    await textSplitter(req, res);
});

app.get(`/api/v1/assistant/chain`, async ( req, res ) => {
    await simpleSequentialChain(req, res);
});

app.get(`/api/v1/assistant/summaryChain`, async ( req, res ) => {
    await summaryChain(req, res);
});

app.get(`/api/v1/assistant/agent`, async ( req, res ) => {
    await agent(req, res);
});


// tutorials 

    app.post(`/api/v1/assistant/completion`, async ( req, res ) => {

        const u = req.body.u
        const a = req.body.a
        const userMessage = req.body.userMessage
        const llm = req.body.llm

        await assistantCompletion(u, a, llm, userMessage, req, res);
    });

    app.get(`/api/v1/assistant/JSONhandler`, async ( req, res ) => {
        await jsonHandler(req, res);
    });


    app.get(`/api/v1/assistant/pineconeStore`, async ( req, res ) => {
        const input = req.query.input
        await pineconeVectorStore(input);
    });


    app.post(`/api/v1/assistant/simpleTrainedChat`, async ( req, res ) => {

        const u = req.body.u
        const a = req.body.a
        const userMessage = req.body.userMessage
        const llm = req.body.llm

        const contextArr = await pineconeVectorStore(userMessage);
        return await simpleTrainedChats(contextArr, u, a, llm, userMessage, req, res);
        
    });


server.listen(process.env.PORT || 5005, () => {
    
    if(process.env.PORT){
    console.log('Server listneing on port: ' + process.env.PORT )
    }
    console.log('Server listneing on port: 5005');
})

