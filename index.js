const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');
const users = require('./repositories/users');


const app = express();
app.use(bodyParser.urlencoded({ extended:true })); //aplica o middleware automaticamente
app.use(cookieSession({
    keys: ['randomstring']
}));

//req abaixo faz as requisições para o webserver
//res abaixo retorna a resposta do webserver
//get recebe apenas requisições do tipo GET
app.get('/signup', (req, res) =>{
    res.send(`
        <div>
            Seu ID: ${req.session.userId};
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
//middleware function
app.post('/signup', async (req,res) =>{
    const { email, password, passwordConfirmation} = req.body;

    const existingUser = await usersRepo.getOneBy({ email });

    if(existingUser) {
        return res.send('Este email já está sendo usado')
    }

    if (password !== passwordConfirmation) {
        return res.send('Senhas informadas são diferentes')
    }

    //cria um usuario

    const user = await usersRepo.create({ email, password });


    //armazena o ID do usuario em um cookie
    req.session.userId = user.id;
    res.send('<h1>Conta criada!</h1>');
});

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('<h1>Você saiu do sistema!</h1>');
});

app.get('/signin', (req,res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <button>Sign In</button>      
            </form>
        </div>    
    `); //manda uma resposta do server para quem faz a requisição
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email: email });

    if (!user) {
        return res.send('Email não encontrado');        
    }

    const validPassword = await usersRepo.comparePasswords( user.password, password );

    if (!validPassword) {
        return res.send('senha incorreta');
    }

    req.session.userId = user.id;

    res.send('Você está logado corretamente!');
});

//começa a ouvir a porta 3000, envia uma HTTP request
app.listen(3000, () =>{
    console.log('Ouvindo...');
});