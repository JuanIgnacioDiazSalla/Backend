// imports

import productManager from "./dao/productManager.js";

import express from "express";

import { engine } from "express-handlebars";

import { Server } from "socket.io";

import mongoose from "mongoose";

import sessions from "express-session"
import mongoStore from "connect-mongo"

import path from "path";

import __dirname from "./utils.js";

import routerProducts from "./routes/products.router.js";

import routerCart from "./routes/cart.router.js";

import routerSessions from "./routes/sessions.router.js"

import routerView from "./routes/viewRouter.router.js";

// server

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));

app.use(sessions({
    store: mongoStore.create({
        mongoUrl: "mongodb+srv://UsuarioPrueba:CoderHouse@proyectobackend.jn2m7jc.mongodb.net/",
        mongoOptions: {
            dbName: "ecommerce"
        }
    }),
    secret: "codercoder123",
    resave: true,
    saveUninitialized: true
}));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));

app.use('/api/products', routerProducts);

app.use('/api/carts', routerCart);

app.use('/api/sessions', routerSessions)

app.use('/', routerView);

const server = app.listen(PORT, () => {
    console.log(`Server port: ${PORT}`);
});


// mongodb
// usuario: UsuarioPrueba; contraseña: CoderHouse

try {
    await mongoose.connect("mongodb+srv://UsuarioPrueba:CoderHouse@proyectobackend.jn2m7jc.mongodb.net/", { dbName: 'ecommerce' });
    console.log("DB conectada!")
} catch (error) {
    console.log(error);
};