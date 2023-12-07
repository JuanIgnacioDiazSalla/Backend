import { Router } from "express";
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

router.get('/', (req, res) => {

    infoProducts();

    if (!req.query.limit) {

        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('home', { products });

    } else {

        const limite = parseInt(req.query.limit);

        const productsAMostrar = products.slice(0, limite);

        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('home', { productsAMostrar, limite });

    };

});

router.get('/realtimeproducts', (req, res) => {

    infoProducts();

    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('realtimeproducts', { products });


});

export default router;