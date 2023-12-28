import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { usersModel } from "../dao/models/users.model.js";
import { hashPassword, verificationFunction } from "../utils.js";

export const initializePassport = () => {

    passport.use('register', new local.Strategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {

            try {

                let { name, email } = req.body;

                if (email == "adminCoder@coder.com") {
                    return done(null, false);
                };

                if (!name || !email || !password) {
                    return done(null, false);
                };

                let existe = await usersModel.findOne({ email })
                if (existe) {
                    return done(null, false);
                };

                password = hashPassword(password);

                let usuario;

                try {

                    usuario = await usersModel.create({ name, email, password });

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

        clientID: "",

        clientSecret: "",

        callbackURL: "http://localhost:8080/api/sessions/callbackGithub"


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
        let usuario = await usersModel.findById(id)
        return done(null, usuario)
    })
};


/*
callback: http://localhost:8080/api/sessions/callbackGithub

App ID: 754088

Client ID: Iv1.52d29ad27724a3f5

Client Secret: b44642e5b17499eb5158e496c9077be7aa2a5860

*/