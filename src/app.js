// imports

const productManager = require('./productManager.js');

const express = require('express');

const { engine } = require('express-handlebars');

const { Server } = require('socket.io')

const path = require('path');

const routerProducts = require(path.join(__dirname, './routes', 'products.router.js'));

const routerCart = require(path.join(__dirname, './routes', 'cart.router.js'));

const routerView = require(path.join(__dirname, './routes', 'viewRouter.router.js'))

// server

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'))

app.use('/api/products', routerProducts);

app.use('/api/cart', routerCart);

app.use('/', routerView);

const server = app.listen(PORT, () => {
    console.log(`Server port: ${PORT}`);
});

const io = new Server(server);

