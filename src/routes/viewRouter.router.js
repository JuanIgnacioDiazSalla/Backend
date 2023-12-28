import { Router } from "express";

import { cartsModel } from "../dao/models/carts.model.js";
import { productsModel } from "../dao/models/products.model.js";

import path from "path";
import __dirname from "../utils.js";
import fs from "fs";

const pathProducts = path.join(__dirname, '..', 'products')

let products = [];

function infoProducts() {
    if (!fs.existsSync(pathProducts)) {
        products = [];
    } else {
        products = JSON.parse(fs.readFileSync(path.join(pathProducts, 'products.json'), "utf-8"));
    };
};

const router = Router();

const auth = (req, res, next) => {

    if (!req.session.usuario) {
        res.redirect('/login')
    }

    next()
}

router.get('/', auth, (req, res) => {

    res.setHeader('Content-Type', 'text/html')
    res.status(200).render("home");
});

router.get('/login', (req, res) => {

    let { error, message } = req.query


    res.setHeader('Content-Type', 'text/html')
    res.status(200).render("login", { error, message })
});

router.get('/register', (req, res) => {

    let { error } = req.query



    res.setHeader('Content-Type', 'text/html')
    res.status(200).render("register", { error })
});

router.get('/products', auth, async (req, res) => {

    let { limit, page } = req.query;

    let usuario = req.session.usuario;

    console.log("USUARIO:", usuario, usuario.name, usuario.email, usuario.rol);

    if (!usuario.name) {
        usuario.name = "Usuario"
    }

    if (!page) {
        page = 1;
    } else {
        page = parseInt(page);
    };

    let productsMDB = [];

    if (!limit) {
        try {

            productsMDB = await productsModel.paginate({}, { lean: true, page: page })

            console.log(productsMDB)

        } catch (error) {

            console.log('error en get ( "/products" ) sin limite: ', error);

        };

        let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productsMDB;

        res.status(200).render("products", { productsMDB: productsMDB.docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, usuario });

    } else {

        try {

            productsMDB = await productsModel.paginate({}, { lean: true, limit: limit, page: page })

            console.log(productsMDB)

        } catch (error) {

            console.log('error en get ( "/products" ) con limite: ', error);

        };

        let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productsMDB

        res.status(200).render("products", { productsMDB: productsMDB.docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, limit, usuario });

    };

});

router.get('/carts/:cid', async (req, res) => {

    let cartId = req.params.cid;

    let specificCart = [];

    try {

        specificCart = await cartsModel.findOne({ _id: cartId }).lean().populate("products.productId");

        let arrayProducts = specificCart.products;

        res.status(200).render("cart", { arrayProducts, cartId });

    } catch (error) {

        console.log('error en get (" /:cid "):', error)

    };

});

export default router;