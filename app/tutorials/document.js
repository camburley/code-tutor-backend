const { Document } = require("langchain/document");

const document = async (req, res) => {

    const doc = new Document({
        pageContent: "This is my document. It is full of excerpts from the book Call me Ted",
        metadata: {
            documentId: 234234,
            documentSource: "Call Me Ted"
        }
    });

    console.log(`document: \n\n ${JSON.stringify(doc)}`);

    res.status(200).json({ document: doc });
}

module.exports = document;