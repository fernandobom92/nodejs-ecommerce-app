const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
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

router.post(
    '/signup',
    [ requireEmail, requirePassword, requirePasswordConfirmation ],
    handleErrors(signupTemplate)  ,   
    async (req,res) => {
        const { email, password } = req.body; 
        const user = await usersRepo.create({ email, password });

        req.session.userId = user.id;

        res.redirect('/admin/products');
    }
);

router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/signin');
});

router.get('/signin', (req,res) => {
    res.send(signinTemplate({})); //objeto vazio evita erros ao receber argumentos vazios
});

router.post(
    '/signin',
    [ requireEmailExists, requireValidPasswordForUser ],
    handleErrors(signinTemplate),
    async (req, res) => {
        const { email } = req.body;

        const user = await usersRepo.getOneBy({ email });

        req.session.userId = user.id;

        res.redirect('/admin/products');
});

module.exports = router;