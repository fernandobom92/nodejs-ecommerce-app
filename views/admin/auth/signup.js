const layout = require('../layout.js');
const { getError } = require('../../helpers.js');

module.exports = ({ req, errors }) => {
    return layout({
        content: `
            <div>
                Seu ID: ${req.session.userId};
                <form method="POST">
                    <input name="email" placeholder="email" />
                    ${getError(errors, 'email')}
                    <input name="password" placeholder="password" />
                    ${getError(errors, 'password')}
                    <input name ="passwordConfirmation" placeholder="password confirmation" />
                    ${getError(errors, 'passwordConfirmation')}
                    <button>Signup</button>      
                </form>
            </div>
        `
    });
};