const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth.js');
const adminProductsRouter = require('./routes/admin/products.js');
const productsRouter = require('./routes/products');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended:true })); //aplica o middleware automaticamente
app.use(
    cookieSession({
        keys: ['randomstring']
    })
);

app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);

//começa a ouvir a porta 3000, envia uma HTTP request
app.listen(3000, () =>{
    console.log('Ouvindo...');
});