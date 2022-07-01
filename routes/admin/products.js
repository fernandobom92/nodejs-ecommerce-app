const express = require('express');

const router = express.Router();

router.get('/admin/products', (req, res) => {
    res.send('Página de produtos!');
});

router.get('/admin/products/new', (req, res) => {
    res.send('Página de cadastro de produtos!');
});

module.exports = router;