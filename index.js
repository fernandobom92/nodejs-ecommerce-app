const express = require('express');

const app = express();

//req abaixo faz as requisições para o webserver
//res abaixo retorna a resposta do webserver
//get recebe apenas requisições do tipo GET
app.get('/', (req, res) =>{
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name ="passwordConfirmation" placeholder="password confirmation" />
                <button>Signup</button>      
            </form>
        </div>    
    `); //manda uma resposta do server para quem faz a requisição
});

//post recebe apenas requisições do tipo POST
app.post('/', (req,res) =>{
    res.send('<h1>Conta criada com sucesso!</h1>');
});

//começa a ouvir a porta 3000, envia uma HTTP request
// Host: localhost
// Port: 3000
// Path: '/'
// Method: 'GET'
app.listen(3000, () =>{
    console.log('ouvindo...');
});