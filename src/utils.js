import { fileURLToPath } from "url";
import { dirname } from "path";

import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const verificationFunction = (usuario, password) => bcrypt.compareSync(password, usuario.password);

export const auth = (req, res, next) => {

    if (!req.session.usuario) {
        res.redirect('/login')
    }

    next()
};