import { productsModel } from "../dao/models/products.model.js";
import { usersModel } from "../dao/models/users.model.js";

export class ProductsController {

    static async getProducts(req, res) {

        let { limit, page, sort, query } = req.query;  //sort puede ser utilizado con 1, -1, asc, desc

        if (!page) {
            page = 1;
        } else {
            page = parseInt(page);
        };

        if (sort == 1) {
            sort = "asc";
        } else if (sort == -1) {
            sort = "desc";
        } else if (!sort) {
            sort = null;
        }

        let productsMDB = [];

        if (!limit) {
            try {

                sort != null ? productsMDB = await productsModel.paginate({}, { lean: true, page: page, sort: { price: sort } }) : productsMDB = await productsModel.paginate({}, { lean: true, page: page })

            } catch (error) {

                req.Logger.error("error en get / sin limite" + " " + error.message)

            };

            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productsMDB;

            res.status(200).json({ status: "success", payload: productsMDB.docs, limit: 10, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage });

        } else {

            try {

                sort != null ? productsMDB = await productsModel.paginate({}, { lean: true, limit: limit, page: page, sort: { price: sort } }) : productsMDB = await productsModel.paginate({}, { lean: true, limit: limit, page: page })

            } catch (error) {

                req.Logger.error("error en get / con limite" + " " + error.message)

            };

            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productsMDB

            res.status(200).json({ status: "success", payload: productsMDB.docs, limit, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage });

        };

    }

    static async getSpecificProduct(req, res) {

        const productId = req.params.pid;

        req.Logger.info("product id" + " " + productId)

        let specificProduct = [];

        try {

            specificProduct = await productsModel.findOne({ _id: productId });

        } catch (error) {

            req.Logger.error("error en get /:pid" + " " + error.message)

        };


        res.status(200).json({ specificProduct });

    }

    static async postProduct(req, res) {

        //infoProductsFS();

        const { title, description, price, thumbnail, code, stock, category, status, owner } = req.body

        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({ error: "Faltan propiedades para poder agregar el producto!  Lista de propiedades necesarias: title description price thumbnail code stock category." })
        } else {

            let duplicateProduct = "";

            try {

                duplicateProduct = await productsModel.find({ code: code, }).lean();



            } catch (error) {

                req.Logger.error("error en post /" + " " + error.message)

            };


            if (duplicateProduct == "" || duplicateProduct == null) {
                try {

                    req.Logger.info(duplicateProduct + typeof duplicateProduct)

                    let newProduct = await productsModel.create({ title, description, price, thumbnail, code, stock, category, status, owner });

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ newProduct: newProduct });
                } catch (error) {

                    req.Logger.error("error en post / producto duplicado /" + " " + error.message)

                }

            } else {

                req.Logger.info("producto duplicado:", duplicateProduct)

                res.setHeader('Content-Type', 'application/json')
                res.status(400).json({ error: "El producto que intenta añadir se encuentra duplicado." })

            };
        };
    }

    static async putProduct(req, res) {

        const productId = req.params.pid;

        let specificProduct = "";

        try {

            specificProduct = await productsModel.findOne({ _id: productId });

        } catch (error) {

            req.Logger.error("error en put / producto especifico" + " " + error.message)

        };

        if (specificProduct = "") {
            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({ error: "No se ha encontrado un producto que posea esa id." })

        } else {
            const { title, description, price, thumbnail, code, stock, category, status, owner } = req.body;

            let duplicateProduct = "";

            try {

                duplicateProduct = await productsModel.find({ title: title, code: code }).lean();

            } catch (error) {

                req.Logger.error("error en put / producto duplicado" + " " + error.message)

            };


            if (duplicateProduct == "" || duplicateProduct == null) {

                try {

                    specificProduct = await productsModel.updateOne({ _id: productId }, { $set: { "title": title, "description": description, "price": price, "thumbnail": thumbnail, "code": code, "stock": stock, "category": category, "status": status, "owner": owner } });

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ updatedProduct: "El producto a sido actualizado con éxito!" });
                } catch (error) {

                    req.Logger.error("error en put / acualizando producto" + " " + error.message)

                };

            } else {

                req.Logger.info("producto duplicado" + " " + duplicateProduct)

                res.setHeader('Content-Type', 'application/json')
                res.status(400).json({ error: "El producto que intenta modificar posee un codigo duplicado." })

            };
        }



    }

    static async deleteProduct(req, res) {

        //infoProductsFS();
        /*let usuario = req.session.usuario

        let ownerId

        try {
            ownerId = await usersModel.findOne({ email: usuario.email })
        } catch (error) {
            req.Logger.error("error en delete /:pid / buscando user / " + " " + error.message)
        }

        if (usuario.rol !== "admin" || usuario.rol !== "premium") {

            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: "No posee las características para realizar esta acción" });

        } else if (usuario.rol === "premium") {
            let { pid } = req.params;

            let specificProduct = "";

            let deletedProduct = "";

            try {

                specificProduct = await productsModel.findOne({ _id: pid });

            } catch (error) {

                req.Logger.error("error en delete /:pid" + " " + error.message)

            };

            if (specificProduct = "") {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: "No se ha encontrado un producto que posea esa id." });

            } else if (specificProduct.owner === ownerId._id) {

                deletedProduct = await productsModel.deleteOne({ _id: pid });

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ deletedProduct: "El producto a sido eliminado con éxito!" });
            };
        } else if (usuario.rol === "admin") {*/
        let { pid } = req.params;

        let specificProduct = "";

        let deletedProduct = "";

        try {

            specificProduct = await productsModel.findOne({ _id: pid });

        } catch (error) {

            req.Logger.error("error en delete /:pid" + " " + error.message)

        };

        if (specificProduct = "") {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: "No se ha encontrado un producto que posea esa id." });

        } else {

            deletedProduct = await productsModel.deleteOne({ _id: pid });

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ deletedProduct: "El producto a sido eliminado con éxito!" });
        };
    }
}

//}