
const { HumanChatMessage, SystemChatMessage, AIChatMessage } = require("langchain/schema");

function formatMessages( userList, assistantList, PROMPT) {
    const formatted_messages = [ new SystemChatMessage(PROMPT)];

    for ( let i = 0; i < assistantList.length; i++ ){
        formatted_messages.push(new AIChatMessage(assistantList[i]));
        if( i < userList.length){
            formatted_messages.push(new HumanChatMessage(userList[i]));
        }
    }

    if(userList.length > assistantList.length){
        formatted_messages.push(new HumanChatMessage(userList[userList.length - 1]));
    }

    return formatted_messages;
}

module.exports = formatMessages; 