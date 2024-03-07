
import { Router } from "express";

import { ProductsController } from "../controller/products.controller.js";

import path from "path";
import __dirname from "../utils.js";
import fs from "fs";

import { authAdmin, authCreateProducts } from "../utils.js";

const pathProducts = path.join(__dirname, '..', 'products')

const router = Router();

router.get('/', authAdmin, ProductsController.getProducts);

router.get('/:pid', authAdmin, ProductsController.getSpecificProduct);

router.post('/', authCreateProducts, ProductsController.postProduct);

router.put('/:pid', ProductsController.putProduct);

router.delete('/:pid', ProductsController.deleteProduct);

export default router;