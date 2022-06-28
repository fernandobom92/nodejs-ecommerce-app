const express = require('express');
const usersRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup.js');
const signinTemplate = require('../../views/admin/auth/signin.js');

const router = express.Router();


router.get('/signup', (req, res) =>{
    res.send(signupTemplate({ req }));
});

router.post('/signup', async (req,res) =>{
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

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('<h1>Você saiu do sistema!</h1>');
});

router.get('/signin', (req,res) => {
    res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
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

module.exports = router;