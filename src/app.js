// imports

const productManager = require('./productManager.js');

const express = require('express');

const products = require('./products/products.json')

// server

const PORT = 8080;

const app = express();

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send("Entrega nro 3 con servidor express")
});

app.get('/products', (req, res) => {

    if (!req.query.limit) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(products);

    } else {

        const limite = parseInt(req.query.limit);

        const productsAMostrar = products.slice(0, limite);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(productsAMostrar);

    };

});

app.get('/products/:pid', (req, res) => {

    const productId = parseInt(req.params.pid);

    const specificProduct = products.find(product => product.id === productId);

    if (!specificProduct) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send("Error: El producto no existe.")
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(specificProduct);
    };

});


const server = app.listen(PORT)