// Imports
import { Router } from "express";

import { cartsModel } from "../dao/models/carts.model.js";
import { productsModel } from "../dao/models/products.model.js";

import path from "path";
import __dirname from "../utils.js";
import fs from "fs";

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

router.get('/', async (req, res) => {

    let cartsMDB = [];

    if (!req.query.limit) {
        try {

            cartsMDB = await cartsModel.find({}).lean();

        } catch (error) {

            console.log('error en get ( "/" ) sin limite: ', error);

        };
        res.status(200).json({ cartsMDB });
    } else {

        try {

            const limite = parseInt(req.query.limit);

            cartsMDB = await cartsModel.find({}).limit(limite).lean();

        } catch (error) {

            console.log('error en get ( "/" ) con limite: ', error);

        };

        res.status(200).json(cartsMDB);

    };

});

router.get('/:cid', async (req, res) => {

    //infoCart();

    let cartId = req.params.cid;

    let specificCart = [];

    try {

        specificCart = await cartsModel.findOne({ _id: cartId });

    } catch (error) {

        console.log('error en get (" /:cid "):', error)

    };


    res.status(200).json({ specificCart });

});

router.post('/', async (req, res) => {

    //infoCart();
    //infoProducts();

    const { products } = req.body

    let productsLength = products.length

    let verified = "";

    for (let step = 0; step < productsLength; step++) {

        let productVerification = "";

        try {

            productVerification = await productsModel.find({ _id: products[step].productId }).lean();

            console.log("productVerification: ", productVerification);

        } catch (error) {

            console.log('error en post ( "/" ) productVerification: ', error);

        };
        if (productVerification == "") {
            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({ error: "Faltan propiedades para poder agregar el carrito!" })
            return verified = false;
        } else {
            return verified = true;
        }

    };

    if (verified = true) {
        try {

            let newCart = await cartsModel.create({ products });

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ newCart: newCart });

        } catch (error) {

            console.log("error en post (' / '):", error);

        };
    }

});



router.post('/:cid/products/:pid', async (req, res) => {

    //infoCart();

    let { cid, pid } = req.params

    let specificCart = "";

    try {

        specificCart = await cartsModel.findOne({ _id: cid });

    } catch (error) {

        console.log('error en post (" /:cid "):', error)

    };

    if (specificCart == "") {

        res.setHeader('Content-Type', 'application/json');
        res.status(404).json({ error: "El Carrito no existe." });

    } else {

        const { quantity } = req.body

        let productVerification = "";

        try {

            productVerification = await productsModel.find({ _id: pid }).lean();

            console.log("productVerification: ", productVerification);

        } catch (error) {

            console.log('error en post ( "/" ) productVerification: ', error);

        };



        if (productVerification == "") {
            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({ error: "Faltan propiedades para poder agregar el carrito!" })
        } else {

            let index = specificCart.products.findIndex((element) => {
                console.log(`id del elemento ${element}:`, element.productId, "que busco:", pid)
                element.productId = pid;
            })

            console.log("index = ", index)

            if (index = -1) {

                let updateCart = await cartsModel.findOneAndUpdate({ _id: cid }, { $push: { "products": { "productId": pid, "quantity": quantity } } })

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ updatedCart2: updateCart });

            } else {

                let updateCart = await cartsModel.updateOne({ _id: cid, productId: pid }, { $inc: { "quantity": quantity } })

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ updatedCart1: updateCart });

            }


        };
    };


});

export default router;

