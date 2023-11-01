// imports

const productManager = require('./productManager');

const express = require('express');

const products = require('../products/products')

// server

const PORT = 8080;

const app = express();

app.get('/', (req, res) => {
    res.send("Entrega nro 3 con servidor express")
});

app.get('/products', (req, res) => {

    if (!req.query.limit) {

        res.send(products);

    } else {

        const limite = parseInt(req.query.limit);

        const productsAMostrar = products.slice(0, limite);

        res.send(productsAMostrar);

    };

});

app.get('/products/:pid', (req, res) => {

    const productId = parseInt(req.params.pid);

    const specificProduct = products.find(product => product.id === productId);

    if (!specificProduct) {
        res.send("Error: El producto no existe.")
    } else {
        res.send(specificProduct);
    };

    res.send(specificProduct);

});


const server = app.listen(PORT)