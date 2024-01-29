import { cartsModel } from "../dao/models/carts.model.js";
import { productsModel } from "../dao/models/products.model.js";

export class ViewRouterController {

    static async getProducts(req, res) {

        let { limit, page } = req.query;

        let usuario = req.session.usuario;
        console.log("USUARIO:", usuario, usuario.first_name, usuario.email, usuario.rol);
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

                console.log(productsMDB)

            } catch (error) {

                console.log('error en get ( "/products" ) sin limite: ', error);

            };

            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productsMDB;

            res.status(200).render("products", { productsMDB: productsMDB.docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, usuario });

        } else {

            try {

                productsMDB = await productsModel.paginate({}, { lean: true, limit: limit, page: page })

                console.log(productsMDB)

            } catch (error) {

                console.log('error en get ( "/products" ) con limite: ', error);

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

            console.log('error en get (" /:cid "):', error)

        };

    }

}