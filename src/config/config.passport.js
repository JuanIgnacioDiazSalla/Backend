import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { usersModel } from "../dao/models/users.model.js";
import { hashPassword, verificationFunction } from "../utils.js";
import { cartsModel } from "../dao/models/carts.model.js";
import { config } from "./config.js";

export const initializePassport = () => {

    passport.use('register', new local.Strategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {

            try {

                let { first_name, last_name, age, email, cart } = req.body;

                if (email == "adminCoder@coder.com") {
                    return done(null, false);
                };

                if (!first_name || !last_name || !age || !email || !password || !cart) {
                    return done(null, false);
                };

                let existeCart = await cartsModel.findOne({ _id: cart })
                if (!existeCart) {
                    return done(null, false);
                };


                let existe = await usersModel.findOne({ email })
                if (existe) {
                    return done(null, false);
                };

                password = hashPassword(password);

                let usuario;

                try {

                    usuario = await usersModel.create({ first_name, last_name, age, email, password, cart });

                    done(null, usuario);

                } catch (error) {

                    done(null, false);

                };


            } catch (error) {
                done(error);
            };

        }
    ));

    passport.use('login', new local.Strategy(
        {

            usernameField: 'email'
        },
        async (username, password, done) => {

            try {

                if (!username || !password) {
                    return done(null, false);
                }

                if (username == "adminCoder@coder.com" && password == "adminCod3r123") {

                    let usuario = ({ first_name: "ADMIN", email: "adminCoder@coder.com", rol: "admin", _id: 1 })

                    return done(null, usuario);
                }

                let usuario = await usersModel.findOne({ email: username }).lean();

                if (!usuario) {
                    return done(null, false)
                }
                if (!verificationFunction(usuario, password)) {
                    return done(null, false)
                }

                delete usuario.password
                return done(null, usuario)

            } catch (error) {
                done(error, null)
            }

        }
    ));

    passport.use('github', new github.Strategy({

        clientID: config.CLIENTID,

        clientSecret: config.CLIENTSECRET,

        callbackURL: config.CALLBACKURL


    },
        async (accessToken, refreshToken, profile, done) => {

            try {

                let usuario = await usersModel.findOne({ email: profile._json.email });

                if (!usuario) {
                    let datosUsuario = {
                        name: profile._json.name,
                        email: profile._json.email,
                        rol: "usuario"
                    }

                    usuario = await usersModel.create(datosUsuario)
                }
                return done(null, usuario)


            } catch (error) {
                return done(error)
            }

        }));


    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id)
    })

    passport.deserializeUser(async (id, done) => {
        if (id == 1) {
            let usuario = ({ first_name: "ADMIN", email: "adminCoder@coder.com", rol: "admin", _id: 1 })
            return done(null, usuario)
        }
        let usuario = await usersModel.findById(id)
        return done(null, usuario)
    })
};

