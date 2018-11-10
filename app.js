const prompt = require('prompt-sync')();
const watson = require('watson-developer-cloud/assistant/v1');
require('dotenv').config()

const chatbot = new watson({
    version: process.env.VERSION,
    iam_apikey: process.env.IAM_APIKEY
})

const workspace_id = process.env.WORKSPACE_ID;

// sempre começa a conversação com uma mensagem vazia para cair no welcome
chatbot.message({
    workspace_id
}, trataResposta)

let fimDeConversa = false;

function trataResposta(err, resposta) {
    if (err) {
        console.log(err); // caso tenha erro
        return;
    }

    // detecta a intenção do usuário
    if (resposta.intents.length > 0) {
        console.log('Eu detectei a intenção: ' + resposta.intents[0].intent);
        if (resposta.intents[0].intent == 'despedida') {
            fimDeConversa = true;
        }
    }

    // exibe a resposta do dialogo, caso haja
    if (resposta.output.text.length > 0) {
        console.log(resposta.output.text[0])
    }

    if (!fimDeConversa) {
        const mensagemUsuario = prompt('>>');
        chatbot.message({
            workspace_id,
            input: {text: mensagemUsuario},
            context: resposta.context
        }, trataResposta);
    }
    
}