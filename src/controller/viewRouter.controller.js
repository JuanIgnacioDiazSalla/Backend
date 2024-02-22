import { cartsModel } from "../dao/models/carts.model.js";
import { productsModel } from "../dao/models/products.model.js";

export class ViewRouterController {

    static async getProducts(req, res) {

        let { limit, page } = req.query;

        let usuario = req.session.usuario;
        req.Logger.info("USUARIO:" + " " + usuario + " " + usuario.first_name + " " + usuario.email + " " + usuario.rol);
        if (!usuario.name) {
            usuario.name = "Usuario"
        }

        if (!page) {
            page = 1;
        } else {
            page = parseInt(page);
        };

        let productsMDB = [];

        if (!limit) {
            try {

                productsMDB = await productsModel.paginate({}, { lean: true, page: page })

            } catch (error) {

                req.Logger.error("error en get /products / sin limite " + " " + error.message)

            };

            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productsMDB;

            res.status(200).render("products", { productsMDB: productsMDB.docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, usuario });

        } else {

            try {

                productsMDB = await productsModel.paginate({}, { lean: true, limit: limit, page: page })

            } catch (error) {

                req.Logger.error("error en get /products / con limite " + " " + error.message)

            };

            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productsMDB

            res.status(200).render("products", { productsMDB: productsMDB.docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, limit, usuario });

        };

    }

    static async getSpecificCart(req, res) {

        let cartId = req.params.cid;

        let specificCart = [];

        try {

            specificCart = await cartsModel.findOne({ _id: cartId }).lean().populate("products.productId");

            let arrayProducts = specificCart.products;

            res.status(200).render("cart", { arrayProducts, cartId });

        } catch (error) {

            req.Logger.error("error en get /:cid   " + " " + error.message)

        };

    }

    static getLoggerTest(req, res) {
        req.Logger.debug("mensaje desde debug")
        req.Logger.http("mensaje desde http")
        req.Logger.info("mensaje desde info")
        req.Logger.warning("mensaje desde warning")
        req.Logger.error("mensaje desde error")
        req.Logger.fatal("mensaje desde fatal")
        res.status(200).json({ test: "Test enviado a consola!" });
    }

}