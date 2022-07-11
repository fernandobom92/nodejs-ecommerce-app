const { validationResult } = require('express-validator');

module.exports = {
    handleErrors(templateFunction, dataCallback) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {

                let data = {}; //variavel declarada fora por causa do escopo e o objeto vazio evita erros ao mesclar objetos
                if (dataCallback) {
                    data = await dataCallback(req);
                }

                return res.send(templateFunction({ errors, ...data })); //os 3 pontos mesclam os dados dos dois objetos
            }

            next();
        };
    },
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect('/signin');
        }

        next();
    }
};