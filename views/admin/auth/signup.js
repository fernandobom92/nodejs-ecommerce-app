const layout = require('../layout.js');

module.exports = ({ req }) => {
    return layout({
        content: `
            <div>
                Seu ID: ${req.session.userId};
                <form method="POST">
                    <input name="email" placeholder="email" />
                    <input name="password" placeholder="password" />
                    <input name ="passwordConfirmation" placeholder="password confirmation" />
                    <button>Signup</button>      
                </form>
            </div>
        `
    });
};