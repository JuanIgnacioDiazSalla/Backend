
const { Router } = require('express')
const path = require('path')
const fs = require('fs')

const pathProducts = path.join(__dirname, '..', 'products')

let products = [];

function infoProducts() {
    if (!fs.existsSync(pathProducts)) {
        products = [];
    } else {
        products = JSON.parse(fs.readFileSync(path.join(pathProducts, 'products.json'), "utf-8"));
    };
}

const router = Router();

router.get('/', (req, res) => {

    infoProducts();

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

router.get('/:pid', (req, res) => {

    infoProducts();

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

router.post('/', (req, res) => {

    infoProducts();

    const { title, description, price, thumbnail, code, stock, category, status } = req.body

    if (products.length > 0) {
        let duplicateProduct = products.some(product => code === product.code);

        if (duplicateProduct == true) {
            res.setHeader('Content-Type', 'text/plain')
            res.status(400).send("Error: El producto que intenta añadir se encuentra duplicado.")
        } else {

            // creando id y añadiendo a array

            let id = products[products.length - 1].id + 1;

            let newProduct = { title, description, price, thumbnail, code, stock, category, status, id };

            products.push(newProduct);

            // añadiendo al json

            const jsonProducts = JSON.stringify(products, null, 5);

            fs.writeFileSync(path.join(pathProducts, 'products.json'), jsonProducts, { encoding: "utf-8" });

            res.setHeader('Content-Type', 'text/plain')
            res.status(200).send("Producto agregado correctamente!")

        };
    } else {

        // creando id y añadiendo a array

        let id = 1;

        let newProduct = { title, description, price, thumbnail, code, stock, category, status, id };

        products.push(newProduct);

        // creando json

        const jsonProducts = JSON.stringify(products, null, 5);

        fs.mkdirSync(pathProducts)

        fs.writeFileSync(path.join(pathProducts, 'products.json'), jsonProducts, { encoding: "utf-8" });

        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send("Producto agregado correctamente!");

    };
});

router.put('/:pid', (req, res) => {

    infoProducts();

    let { pid } = req.params;

    pid = parseInt(pid);

    if (isNaN(pid)) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(400).json('Error: Indique un id numérico');
    };

    const { title, description, price, thumbnail, code, stock, category, status } = req.body;

    let specificProduct = products.find(product => product.id === pid);

    if (specificProduct != null) {
        specificProduct.title = title;
        specificProduct.description = description;
        specificProduct.price = price;
        specificProduct.thumbnail = thumbnail;
        specificProduct.code = code;
        specificProduct.stock = stock;
        specificProduct.category = category;
        specificProduct.status = status;
        fs.writeFileSync(path.join(pathProducts, 'products.json'), JSON.stringify(products, null, 5), { encoding: "utf-8" });
        res.setHeader('Content-Type', 'aplication/json')
        res.status(200).send(specificProduct)
    } else {
        res.setHeader('Content-Type', 'text/plain');
        res.status(400).json('Error: Producto no encontrado')
    };
});

router.delete('/:pid', (req, res) => {

    infoProducts();

    let { pid } = req.params;

    pid = parseInt(pid);

    if (isNaN(pid)) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(400).json('Error: Indique un id numérico');
    };

    let indiceProducts = products.findIndex(products => products.id === pid)
    if (indiceProducts === -1) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).json({ error: `No existen usuarios con id ${pid}` });
    };

    let deletedProduct = products.splice(indiceProducts, 1)

    fs.writeFileSync(path.join(pathProducts, 'products.json'), JSON.stringify(products, null, 5), { encoding: "utf-8" });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        deletedProduct
    });
});

module.exports = router;