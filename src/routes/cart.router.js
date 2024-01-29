// Imports
import { Router } from "express";

import { CartController } from "../controller/cart.controller.js";

import path from "path";
import __dirname from "../utils.js";
import fs from "fs";

const pathProducts = path.join(__dirname, '..', 'products', 'products.json')

const pathCart = path.join(__dirname, '..', 'cart')

const router = Router();

router.get('/', CartController.getCarts);

router.get('/:cid', CartController.getSpecificCart);

router.post('/', CartController.postCart);

router.post('/:cid/products/:pid', CartController.postProductToCart);

router.put('/:cid/products/:pid', CartController.putProductInCart);

router.put('/:cid', CartController.putCart);

router.delete('/:cid', CartController.deleteCart);

router.delete('/:cid/products/:pid', CartController.deleteProductFromCart);

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

