const express = require('express');
const { check, validationResult } = require('express-validator'); //colchetes serve para pegar apenas a função especifica do pacote
const usersRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup.js');
const signinTemplate = require('../../views/admin/auth/signin.js');
const { 
    requireEmail, 
    requirePassword, 
    requirePasswordConfirmation, 
    requireEmailExists,
    requireValidPasswordForUser
} = require('./validation.js');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post('/signup', [ requireEmail, requirePassword, requirePasswordConfirmation ],     
    async (req,res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.send(signupTemplate({ req, errors })); //exporta erros somente se houver algum erro de validação
        }

        const { email, password, passwordConfirmation} = req.body; 
        const user = await usersRepo.create({ email, password });

        req.session.userId = user.id;

        res.send('<h1>Conta criada!</h1>');
    }
);

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('<h1>Você saiu do sistema!</h1>');
});

router.get('/signin', (req,res) => {
    res.send(signinTemplate({}));
});

router.post('/signin', [ requireEmailExists, requireValidPasswordForUser ], 
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.send(signinTemplate({ errors }));
        }

        const { email } = req.body;

        const user = await usersRepo.getOneBy({ email });

        req.session.userId = user.id;

        res.send('Logado corretamente!');
});

module.exports = router;