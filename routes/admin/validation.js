const { check } = require('express-validator');
const usersRepo = require('../../repositories/users.js');

module.exports = {
    requireTitle: check('title')
        .trim()
        .isLength({ min:5, max:40 })
        .withMessage('Precisa ter entre 5 e 40 caracteres'),
    requirePrice: check('price')
        .trim()
        .toFloat() //converte para numeros fracionados, tambem pode ser usado toInt() para numeros inteiros
        .isFloat({ min:1 })
        .withMessage('O preço do produto tem que ser maior que 1'), //valor minimo para o produto
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Precisa ser um email valido')
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({ email });
            if(existingUser) {
                throw new Error('Este email já está sendo usado');
            }
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min:4, max:20})
        .withMessage('Precisa conter entre 4 e 20 caracteres'),
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Precisa ser entre 4 e 20 caracteres')
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('As senhas tem ser iguais')
            } else {
                return true;
            }
        }),
    requireEmailExists: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Forneça um email valido')
        .custom(async ( email ) => {
            const user = await usersRepo.getOneBy({ email });
            if (!user) {
                throw new Error('email não encontrado');
            }
        }),
    requireValidPasswordForUser: check('password')
        .trim()
        .custom(async (password, { req }) => {
            const user = await usersRepo.getOneBy({ email: req.body.email });

            if (!user) {
                throw new Error('Senha incorreta');    
            } 

            const validPassword = await usersRepo.comparePasswords( user.password, password );

            if (!validPassword) {
                throw new Error('Senha incorreta');
            } 
        }) 
};