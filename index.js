const express = require('express');

const app = express();

//req abaixo faz as requisições para o webserver
//res abaixo retorna a resposta do webserver
app.get('/', (req, res) =>{
    res.send(`
        <div>
            <form>
                <input placeholder="email" />
                <input placeholder="password" />
                <input placeholder="password confirmation" />
                <button>Signup</button>      
            </form>
        </div>    
    `); //manda uma resposta do server para quem faz a requisição
});

//começa a ouvir a porta 3000, envia uma HTTP request
// Host: localhost
// Port: 3000
// Path: '/'
// Method: 'GET'
app.listen(3000, () =>{
    console.log('ouvindo...');
});