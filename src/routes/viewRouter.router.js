import { Router } from "express";

import { ViewRouterController } from "../controller/viewRouter.controller.js";


import path from "path";
import __dirname from "../utils.js";
import fs from "fs";

import { auth } from "../utils.js";

const pathProducts = path.join(__dirname, '..', 'products')

const router = Router();

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

router.get('/products', auth, ViewRouterController.getProducts);

router.get('/carts/:cid', auth, ViewRouterController.getSpecificCart);

export default router;