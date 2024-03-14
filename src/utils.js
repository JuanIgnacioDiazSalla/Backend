import { fileURLToPath } from "url";
import { dirname } from "path";

import { config } from "./config/config.js";

import winston from "winston";

import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const verificationFunction = (usuario, password) => bcrypt.compareSync(password, usuario.password);

export const auth = (req, res, next) => {

    if (!req.session.usuario) {
        res.redirect('/login');
    };

    next();
};

export const authAdmin = (req, res, next) => {

    console.log("autenticando admin", req.session, req.session.usuario, req.session.usuario.rol)
    if (req.session.usuario.rol !== "admin") {
        res.redirect('/login?error=Su cuenta no cumple con las características para realizar esa acción.');
    };

    next();
};

export const authUser = (req, res, next) => {

    if (req.session.usuario.rol !== "usuario") {
        res.redirect('/login?error=Su cuenta no cumple con las características para realizar esa acción.');
    };

    next();
};

export const authCreateProducts = (req, res, next) => {

    if (req.session.usuario.rol !== "premium" || req.session.usuario.rol !== "admin") {
        res.redirect('/login?error=Su cuenta no cumple con las características para realizar esa acción.');
    };

}

const myLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
}

const transportDev = new winston.transports.Console(
    {
        format: winston.format.simple(),
        level: "debug"
    }
)


const transportProd1 = new winston.transports.Console(
    {
        level: "info", format: winston.format.simple()
    }
)

const transportProd2 = new winston.transports.File(
    {
        filename: "./src/logs/errors.log",
        level: "error",
        format: winston.format.simple()
    }
)

export const logg = (req, res, next) => {
    req.Logger = Logger;
    next();
}

const Logger = winston.createLogger(
    {
        levels: myLevels,
        transports: []
    }
)

if (config.MODE == "dev") {
    console.log("dev")
    Logger.add(transportDev)
} else if (config.MODE == "prod") {
    console.log("prod")
    Logger.add(transportProd1, transportProd2)
}


