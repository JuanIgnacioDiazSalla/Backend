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

import { initializePassport } from "./config/config.passport.js";

import { config } from "./config/config.js";

import passport from "passport";

// server

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));

app.use(sessions({
    store: mongoStore.create({
        mongoUrl: config.MONGO_URL,
        mongoOptions: {
            dbName: config.DBNAME
        }
    }),
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

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
    await mongoose.connect(config.MONGO_URL, { dbName: config.DBNAME });
    console.log("DB conectada!")
} catch (error) {
    console.log(error);
};