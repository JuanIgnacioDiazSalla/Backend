import { Router } from "express";
import crypto from "crypto"

import { usersModel } from "../dao/models/users.model.js";

const router = Router();

router.post('/login', async (req, res) => {

    let { email, password } = req.body

    if (!email || !password) {

        return res.redirect('/login?error=datos no completados');

    } else if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
        req.session.usuario = {
            name: "admin", email: email, rol: "admin"
        };

        return res.redirect(`/products`)
    };

    password = crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")

    let usuario = await usersModel.findOne({ email, password })

    if (!usuario) {
        return res.redirect(`/login?error= credenciales incorrectas`)
    }

    req.session.usuario = {
        name: usuario.name, email: usuario.email, rol: usuario.rol
    }

    res.redirect('/products')

})

router.post('/register', async (req, res) => {

    let { name, email, password } = req.body;

    if (email == "adminCoder@coder.com") {
        return res.redirect(`/register?error= email no valido, intente con otro.`)
    };

    if (!name || !email || !password) {
        return res.redirect('/register?error=datos no completados');
    };

    let existe = await usersModel.findOne({ email })
    if (existe) {
        return res.redirect(`/register?error= usuario con mail ${email} ya existente`);
    };

    password = crypto.createHmac("sha256", "codercoder123").update(password).digest("hex");

    let usuario;

    try {

        usuario = await usersModel.create({ name, email, password });

        res.redirect(`/login?message=Usuario con mail: ${email} registrado correctamente`);

    } catch (error) {

        res.redirect('/register?error= error al crear usuario');

    };


});

router.get('/logout', (req, res) => {

    req.session.destroy(error => {
        if (error) {
            res.redirect('/home?error=fallo en el logout');
        }
    });

    res.redirect('/login');

});

export default router;