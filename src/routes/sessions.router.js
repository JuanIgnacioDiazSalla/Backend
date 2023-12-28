import { Router } from "express";

import { hashPassword, verificationFunction } from "../utils.js";
import passport from "passport";

import { usersModel } from "../dao/models/users.model.js";

const router = Router();

router.get('/github', passport.authenticate('github', {}), (req, res) => { })

router.get('/callbackGithub', passport.authenticate('github', { failureRedirect: "/api/sessions/errorGithub" }), (req, res) => {

    req.session.usuario = req.user
    res.status(200).redirect('/products');
});

router.get('/errorGithub', passport.authenticate('github', {}), (req, res) => {

    res.setHeader('Content-Type', 'aplication/json');
    res.status(200).json({ error: "Error al autenticar" });
});

router.post('/login', passport.authenticate('login', { failureRedirect: "/api/sessions/errorLogin" }), (req, res) => {

    req.session.usuario = {
        name: req.user.name, email: req.user.email, rol: req.user.rol
    }
    res.redirect('/products');

});

router.get('/errorLogin', passport.authenticate('login', {}), (req, res) => {

    res.setHeader('Content-Type', 'aplication/json');
    res.status(200).json({ error: "Error al ingresar" });
});

router.post('/register', passport.authenticate('register', { failureRedirect: "/api/sessions/errorRegister" }), (req, res) => {

    let { email } = req.body;

    res.redirect(`/login?message=Usuario con mail: ${email} registrado correctamente`);

});

router.get('/errorRegister', passport.authenticate('register', {}), (req, res) => {

    res.setHeader('Content-Type', 'aplication/json');
    res.status(200).json({ error: "Error al registrar" });
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