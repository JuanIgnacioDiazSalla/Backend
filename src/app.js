// imports

const productManager = require('./productManager.js');

const express = require('express');

const path = require('path');

const routerProducts = require(path.join(__dirname, './routes', 'products.router.js'));

const routerCart = require(path.join(__dirname, './routes', 'cart.router.js'))

// server

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', routerProducts);

app.use('/api/cart', routerCart);

const server = app.listen(PORT);