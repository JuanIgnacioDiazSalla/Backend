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

    let { limit, page } = req.query;

    if (!page) {
        page = 1;
    } else {
        page = parseInt(page);
    };

    let cartsMDB = [];

    if (!limit) {
        try {

            cartsMDB = await cartsModel.paginate({}, { lean: true, page: page, populate: "products.productId" })

            console.log(cartsMDB)

        } catch (error) {

            console.log('error en get ( "/" ) sin limite: ', error);

        };

        let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = cartsMDB;

        res.status(200).json({ status: "success", payload: cartsMDB.docs, limit: 10, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage });

    } else {

        try {

            cartsMDB = await cartsModel.paginate({}, { lean: true, page: page, populate: true, limit: limit, populate: "products.productId" })

            console.log(cartsMDB)

        } catch (error) {

            console.log('error en get ( "/" ) con limite: ', error);

        };

        let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = cartsMDB;

        res.status(200).json({ status: "success", payload: cartsMDB.docs, limit: limit, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage });

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

            let index = specificCart.products.findIndex((element) => element.productId = pid)

            console.log("index = ", index)

            if (index == -1) {

                let updateCart = await cartsModel.findOneAndUpdate({ _id: cid }, { $push: { "products": { "productId": pid, "quantity": quantity } } })

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ updatedCart2: updateCart });

            } else {

                let updateCart = await cartsModel.updateOne({ _id: cid, "products.productId": pid }, { $inc: { "products.$.quantity": quantity } })

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ updatedCart1: updateCart });

            }


        };
    };


});

router.put('/:cid/products/:pid', async (req, res) => {

    //infoCart();

    let { cid, pid } = req.params

    let specificCart = "";

    try {

        specificCart = await cartsModel.findOne({ _id: cid });

    } catch (error) {

        console.log('error en put (" /:cid/products/:pid "):', error)

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

            console.log('error en put ( "/:cid/products/:pid" ) productVerification: ', error);

        };



        if (productVerification == "") {
            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({ error: "Faltan propiedades para poder modificar el carrito!" })
        } else {

            let index = specificCart.products.findIndex((element) => element.productId = pid)

            console.log("index = ", index)

            if (index == -1) {

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ error: "No se ha encontrado el producto a modificar" });

            } else {

                let updateCart = await cartsModel.updateOne({ _id: cid, "products.productId": pid }, { $set: { "products.$.quantity": quantity } })

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ updatedCart1: updateCart });

            }


        };
    };


});

router.put('/:cid', async (req, res) => {

    //infoProductsFS();

    let { cid } = req.params;

    let specificCart = "";

    try {

        specificCart = await cartsModel.findOne({ _id: cid });

    } catch (error) {

        console.log('error en put (" /:cid ") specificCart', error)

    };

    if (specificCart == "") {

        res.setHeader('Content-Type', 'application/json');
        res.status(404).json({ error: "El Carrito no existe." });

    } else {

        let { newProducts } = req.body;

        let verified = ""

        for (let step = 0; step < newProducts.length; step++) {

            let productVerification = "";

            try {

                productVerification = await productsModel.find({ _id: newProducts[step].productId }).lean();

                console.log("productVerification: ", productVerification);

            } catch (error) {

                console.log('error en putt ( "/:cid" ) productVerification: ', error);

            };
            if (productVerification == "") {
                res.setHeader('Content-Type', 'application/json')
                res.status(400).json({ error: "Faltan propiedades para poder agregar el carrito!" })
                return verified = false;
            }

        };



        if (verified = true) {

            let updateCart

            try {
                updateCart = await cartsModel.updateOne({ _id: cid }, { $set: { "newProducts": newProducts } })

            } catch (error) {
                console.log("error en put ( '/:cid' ) set", error)
            }

            try {
                updateCart = await cartsModel.updateOne({ _id: cid }, { $unset: { products: "" } })

            } catch (error) {
                console.log("error en put ( '/:cid' ) unset", error)
            }

            try {
                updateCart = await cartsModel.updateOne({ _id: cid }, { $rename: { "newProducts": "products" } })

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ updatedCart2: updateCart });
            } catch (error) {
                console.log("error en put ( '/:cid' ) rename", error)
            }

        };
    };

});

router.delete('/:cid', async (req, res) => {

    //infoProductsFS();

    let { cid } = req.params;

    let specificCart = "";

    let deletedCart = "";

    try {

        specificCart = await cartsModel.findOne({ _id: cid });

    } catch (error) {

        console.log('error en delete (" /:cid "):', error)

    };

    if (specificCart = "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).json({ error: "No se ha encontrado un carrito que posea esa id." });

    } else {

        deletedCart = await cartsModel.deleteOne({ _id: cid });

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ deletedCart: deletedCart });
    };
});

router.delete('/:cid/products/:pid', async (req, res) => {

    //infoProductsFS();

    let { cid, pid } = req.params;

    let specificCart = "";

    try {

        specificCart = await cartsModel.findOne({ _id: cid });

    } catch (error) {

        console.log('error en cart delete (" /:cid "):', error)

    };

    let deletedProduct = "";

    if (specificCart == "") {

        res.setHeader('Content-Type', 'application/json');
        res.status(404).json({ error: "El Carrito no existe." });

    } else {

        try {

            deletedProduct = await productsModel.findOne({ _id: pid });

        } catch (error) {

            console.log('error en cart delete (" /:pid "):', error)

        };

        if (deletedProduct = "") {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: "No se ha encontrado un producto que posea esa id." });

        } else {

            let updateCart

            try {

                updateCart = await cartsModel.updateOne({ _id: cid }, { $pull: { "products": { "productId": pid } } });

            } catch (error) {

                console.log('error en cart delete (update cart)', error);

            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ updatedCart1: updateCart });


        };
    }
}
);

/* array de prueba
{
    "products": [
        {
            "productId": "6570f316c29e3b0cc9ae1a3a",
            "quantity": 10
        },
        {
            "productId": "6570f354c29e3b0cc9ae1a3b",
            "quantity": 10
        }
    ]
}
*/

export default router;

