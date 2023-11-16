// Imports
const { Router } = require('express')
const path = require('path')
const fs = require('fs')

const pathProducts = path.join(__dirname, '..', 'products', 'products.json')

const pathCart = path.join(__dirname, '..', 'cart')

let allProducts = [];

function infoProducts() {
    if (!fs.existsSync(pathProducts)) {
        allProducts = [];
    } else {
        allProducts = JSON.parse(fs.readFileSync(pathProducts, "utf-8"));
    };
}

let cart = [];

function infoCart() {
    if (!fs.existsSync(pathCart)) {
        cart = [];
    } else {
        cart = JSON.parse(fs.readFileSync(path.join(pathCart, 'cart.json'), "utf-8"));
    };
}

const router = Router();

router.post('/', (req, res) => {

    infoCart();
    infoProducts();

    const { products } = req.body;

    if (cart.length > 0) {

        // creando id y añadiendo a array

        let idCart = cart[cart.length - 1].idCart + 1;

        let newCart = { products, idCart };

        cart.push(newCart);

        // añadiendo al json

        const jsonCart = JSON.stringify(cart, null, 5);

        fs.writeFileSync(path.join(pathCart, 'cart.json'), jsonCart, { encoding: "utf-8" });

        res.setHeader('Content-Type', 'text/plain')
        res.status(200).send("Carrito agregado correctamente!");


    } else {

        // creando id y añadiendo a array

        let idCart = 1;

        let newCart = { products, idCart };

        cart.push(newCart);

        // creando json

        const jsonCart = JSON.stringify(cart, null, 5);

        fs.mkdirSync(pathCart)

        fs.writeFileSync(path.join(pathCart, 'cart.json'), jsonCart, { encoding: "utf-8" });

        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send("Carrito agregado correctamente!");

    };

});

router.get('/:cid', (req, res) => {

    infoCart();

    const cartId = parseInt(req.params.cid);

    const specificCart = cart.find(cart => cart.idCart === cartId);

    if (!specificCart) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send("Error: El Carrito no existe.")
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(specificCart);
    };

});

router.post('/:cid/products/:pid', (req, res) => {

    infoCart();

    const cartId = parseInt(req.params.cid);

    const productId = parseInt(req.params.pid);

    const specificCart = cart.find(cart => cart.idCart === cartId);

    if (!specificCart) {

        res.setHeader('Content-Type', 'text/plain');

        res.status(404).send("Error: El Carrito no existe.");

    } else {

        const specificProduct = parseInt(specificCart.products.findIndex(product => product.id === productId));

        if (specificProduct === -1) {

            const quantity = 1;

            const newProduct = { pid, quantity };

            specificCart.products.push(newProduct);

            const jsonCart = JSON.stringify(cart, null, 5);

            fs.writeFileSync(path.join(pathCart, 'cart.json'), jsonCart, { encoding: "utf-8" });

            res.setHeader('Content-Type', 'text/plain');
            res.status(200).send('Producto añadido correctamente al carrito!');
        } else {

            let cantidad = specificCart.products[specificProduct].quantity;

            cantidad = cantidad + 1;

            specificCart.products[specificProduct].quantity = cantidad;

            const jsonCart = JSON.stringify(cart, null, 5);

            fs.writeFileSync(path.join(pathCart, 'cart.json'), jsonCart, { encoding: "utf-8" });

            res.setHeader('Content-Type', 'text/plain');
            res.status(200).send('Producto añadido correctamente al carrito!');
        };

    };


});

module.exports = router;

