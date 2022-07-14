const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// recebe um POST request para adicionar um item ao carrinho
router.post('/cart/products', async (req, res) => {
    // verificar se já existe um carrinho
    let cart;
    if (!req.session.cartId) {
        // não existe um carrinho, criamos um novo e adicionamos cartId em req.session.cartId
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        // temos um carrinho, buscar no repositorio
        cart = await cartsRepo.getOne(req.session.cartId);
    }
    
    //procurando items
    const existingItem = cart.items.find( item => item.id === req.body.productId);

    if (existingItem) {
        //aumentar a quantidade em 1 e salvar
        existingItem.quantity++;
    } else {
        //adiciona um novo item ao carrinho
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    res.redirect('/cart');


});

// recebe um GET request para mostrar todos os itens no carrinho
router.get('/cart', async (req,res) => {
    //verifica se o usuario ja possui um item no carrinho

    //direciona para a pagina inicial se o carrinho estiver vazio
    if(!req.session.cartId) {        
        return res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartId);

    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);
        item.product = product;
    }

    res.send(cartShowTemplate({ items: cart.items }));
});
// recebe um POST request para apagar um item do carrinho
router.post('/cart/products/delete', async (req,res) => {
    const { itemId } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    //filter gera um novo array com os itens encontrados dentro de um array
    //gera um novo array excluindo o item que desejamos apagar do carrinho
    const items = cart.items.filter(item => item.id !== itemId);

    await cartsRepo.update(req.session.cartId, { items }); //busca o carrinho no respositorio e atualiza

    res.redirect('/cart');
});

module.exports = router;