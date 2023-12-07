
import { Router } from "express";

import { productsModel } from "../dao/models/products.model.js";

import path from "path";
import __dirname from "../utils.js";
import fs from "fs";

const pathProducts = path.join(__dirname, '..', 'products')

let products = [];

function infoProductsFS() {
    if (!fs.existsSync(pathProducts)) {
        products = [];
    } else {
        products = JSON.parse(fs.readFileSync(path.join(pathProducts, 'products.json'), "utf-8"));
    };
}


const router = Router();

router.get('/', async (req, res) => {

    let productsMDB = [];

    if (!req.query.limit) {
        try {

            productsMDB = await productsModel.find({}).lean();

        } catch (error) {

            console.log('error en get ( "/" ) sin limite: ', error);

        };
        res.status(200).json({ productsMDB });
    } else {

        try {

            const limite = parseInt(req.query.limit);

            productsMDB = await productsModel.find({}).limit(limite).lean();

        } catch (error) {

            console.log('error en get ( "/" ) con limite: ', error);

        };

        res.status(200).json(productsMDB);

    };

});

router.get('/:pid', async (req, res) => {

    //infoProductsFS();

    const productId = req.params.pid;

    let specificProduct = [];

    try {

        specificProduct = await productsModel.findOne({ _id: productId });

    } catch (error) {

        console.log('error en get (" /:pid "):', error)

    };


    res.status(200).json({ specificProduct });

});

router.post('/', async (req, res) => {

    //infoProductsFS();

    const { title, description, price, thumbnail, code, stock, category, status } = req.body

    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).json({ error: "Faltan propiedades para poder agregar el producto!  Lista de propiedades necesarias: title description price thumbnail code stock category." })
    } else {

        let duplicateProduct = "";

        try {

            duplicateProduct = await productsModel.find({ code: code, }).lean();

        } catch (error) {

            console.log('error en post ( "/" ) duplicateProduct: ', error);

        };


        if (duplicateProduct == "" || duplicateProduct == null) {
            try {

                let newProduct = await productsModel.create({ title, description, price, thumbnail, code, stock, category, status });

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ newProduct: newProduct });
            } catch (error) {

                console.log("error en post (' / '):", error);

            }

        } else {

            console.log("producto duplicado:", duplicateProduct)

            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({ error: "El producto que intenta añadir se encuentra duplicado." })

        };
    };
});

router.put('/:pid', async (req, res) => {

    //infoProductsFS();

    const productId = req.params.pid;

    let specificProduct = "";

    try {

        specificProduct = await productsModel.findOne({ _id: productId });

    } catch (error) {

        console.log('error en put (" /:pid "):', error)

    };

    if (specificProduct = "") {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).json({ error: "No se ha encontrado un producto que posea esa id." })

    } else {
        const { title, description, price, thumbnail, code, stock, category, status } = req.body;

        let duplicateProduct = "";

        try {

            duplicateProduct = await productsModel.find({ title: title, code: code }).lean();

        } catch (error) {

            console.log('error en put ( "/" ) duplicateProduct: ', error);

        };


        if (duplicateProduct == "" || duplicateProduct == null) {

            try {

                specificProduct = await productsModel.updateOne({ _id: productId }, { $set: { "title": title, "description": description, "price": price, "thumbnail": thumbnail, "code": code, "stock": stock, "category": category, "status": status } });

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ updatedProduct: specificProduct });
            } catch (error) {

                console.log('error en put (" /:pid "):', error)

            };

        } else {

            console.log("producto duplicado:", duplicateProduct)

            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({ error: "El producto que intenta modificar posee un codigo duplicado." })

        };
    }



});

router.delete('/:pid', async (req, res) => {

    //infoProductsFS();

    let { pid } = req.params;

    let specificProduct = "";

    let deletedProduct = "";

    try {

        specificProduct = await productsModel.findOne({ _id: pid });

    } catch (error) {

        console.log('error en delete (" /:pid "):', error)

    };

    if (specificProduct = "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).json({ error: "No se ha encontrado un producto que posea esa id." });

    } else {

        deletedProduct = await productsModel.deleteOne({ _id: pid });

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ deletedProduct: deletedProduct });
    };
}
);

export default router;