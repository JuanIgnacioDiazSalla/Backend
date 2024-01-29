import { productsModel } from "../dao/models/products.model.js";

export class ProductsController {

    static async getProducts(req, res) {

        let { limit, page, sort, query } = req.query;  //sort puede ser utilizado con 1, -1, asc, desc

        if (!page) {
            page = 1;
        } else {
            page = parseInt(page);
        };

        console.log(sort)

        if (sort == 1) {
            sort = "asc";
        } else if (sort == -1) {
            sort = "desc";
        } else if (!sort) {
            sort = null;
        }

        console.log(sort)

        let productsMDB = [];

        if (!limit) {
            try {

                sort != null ? productsMDB = await productsModel.paginate({}, { lean: true, page: page, sort: { price: sort } }) : productsMDB = await productsModel.paginate({}, { lean: true, page: page })

                console.log(productsMDB)

            } catch (error) {

                console.log('error en get ( "/" ) sin limite: ', error);

            };

            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productsMDB;

            res.status(200).json({ status: "success", payload: productsMDB.docs, limit: 10, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage });

        } else {

            try {

                sort != null ? productsMDB = await productsModel.paginate({}, { lean: true, limit: limit, page: page, sort: { price: sort } }) : productsMDB = await productsModel.paginate({}, { lean: true, limit: limit, page: page })

                console.log(productsMDB)

            } catch (error) {

                console.log('error en get ( "/" ) con limite: ', error);

            };

            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productsMDB

            res.status(200).json({ status: "success", payload: productsMDB.docs, limit, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage });

        };

    }

    static async getSpecificProduct(req, res) {

        const productId = req.params.pid;

        let specificProduct = [];

        try {

            specificProduct = await productsModel.findOne({ _id: productId });

        } catch (error) {

            console.log('error en get (" /:pid "):', error)

        };


        res.status(200).json({ specificProduct });

    }

    static async postProduct(req, res) {

        //infoProductsFS();

        const { title, description, price, thumbnail, code, stock, category, status } = req.body

        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({ error: "Faltan propiedades para poder agregar el producto!  Lista de propiedades necesarias: title description price thumbnail code stock category." })
        } else {

            let duplicateProduct = "";

            try {

                duplicateProduct = await productsModel.find({ code: code, }).lean();

            } catch (error) {

                console.log('error en post ( "/" ) duplicateProduct: ', error);

            };


            if (duplicateProduct == "" || duplicateProduct == null) {
                try {

                    let newProduct = await productsModel.create({ title, description, price, thumbnail, code, stock, category, status });

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ newProduct: newProduct });
                } catch (error) {

                    console.log("error en post (' / '):", error);

                }

            } else {

                console.log("producto duplicado:", duplicateProduct)

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

            console.log('error en put (" /:pid "):', error)

        };

        if (specificProduct = "") {
            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({ error: "No se ha encontrado un producto que posea esa id." })

        } else {
            const { title, description, price, thumbnail, code, stock, category, status } = req.body;

            let duplicateProduct = "";

            try {

                duplicateProduct = await productsModel.find({ title: title, code: code }).lean();

            } catch (error) {

                console.log('error en put ( "/" ) duplicateProduct: ', error);

            };


            if (duplicateProduct == "" || duplicateProduct == null) {

                try {

                    specificProduct = await productsModel.updateOne({ _id: productId }, { $set: { "title": title, "description": description, "price": price, "thumbnail": thumbnail, "code": code, "stock": stock, "category": category, "status": status } });

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ updatedProduct: specificProduct });
                } catch (error) {

                    console.log('error en put (" /:pid "):', error)

                };

            } else {

                console.log("producto duplicado:", duplicateProduct)

                res.setHeader('Content-Type', 'application/json')
                res.status(400).json({ error: "El producto que intenta modificar posee un codigo duplicado." })

            };
        }



    }

    static async deleteProduct(req, res) {

        //infoProductsFS();

        let { pid } = req.params;

        let specificProduct = "";

        let deletedProduct = "";

        try {

            specificProduct = await productsModel.findOne({ _id: pid });

        } catch (error) {

            console.log('error en delete (" /:pid "):', error)

        };

        if (specificProduct = "") {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: "No se ha encontrado un producto que posea esa id." });

        } else {

            deletedProduct = await productsModel.deleteOne({ _id: pid });

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ deletedProduct: deletedProduct });
        };
    }

}