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

router.get('/products', async (req, res) => {

    let { limit, page } = req.query;

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

        res.status(200).render("products", { productsMDB: productsMDB.docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage });

    } else {

        try {

            productsMDB = await productsModel.paginate({}, { lean: true, limit: limit, page: page })

            console.log(productsMDB)

        } catch (error) {

            console.log('error en get ( "/products" ) con limite: ', error);

        };

        let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productsMDB

        res.status(200).render("products", { productsMDB: productsMDB.docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, limit });

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