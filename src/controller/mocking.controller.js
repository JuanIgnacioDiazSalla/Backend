import { productsModel } from "../dao/models/products.model.js";
import { faker } from '@faker-js/faker'

export class MockingController {
    constructor() { }

    static async mockingProducts(req, res) {

        let newMockingProducts = new Array();

        let i = 0;

        do {
            i++;
            console.log("contador", i)
            let title = faker.commerce.product();
            let description = faker.commerce.productDescription();
            let price = faker.commerce.price({ max: 1000 });
            let thumbnail = {};
            let code = `mocking_product_${i}`;
            let stock = faker.number.int({ min: 1, max: 250 });
            let category = faker.commerce.department();
            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                i = 101;
                res.setHeader('Content-Type', 'application/json')
                res.status(400).json({ error: "Faltan propiedades para poder agregar el producto!  Lista de propiedades necesarias: title description price thumbnail code stock category." })
            } else {

                let duplicateProduct = "";

                try {

                    duplicateProduct = await productsModel.find({ code: code, }).lean();

                } catch (error) {
                    i = 101;

                    console.log('error en post ( "/" ) duplicateProduct: ', error);

                };


                if (duplicateProduct == "" || duplicateProduct == null) {
                    try {

                        let newProduct = await productsModel.create({ title, description, price, thumbnail, code, stock, category });

                        newMockingProducts.push({ newProduct });

                    } catch (error) {
                        console.log(newProduct);
                        i = 101;
                        console.log("error en post (' / '):", error);

                    }

                } else {

                    console.log("producto duplicado:", duplicateProduct)

                    i = 101;

                    res.setHeader('Content-Type', 'application/json')
                    res.status(400).json({ error: "El producto que intenta añadir se encuentra duplicado." });

                };
            };

        } while (i < 100);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ products: newMockingProducts });
    }

    static async deleteMockingProducts(req, res) {

        let i = 0;

        do {
            i++;

            let code = `mocking_product_${i}`

            let specificProduct = "";

            let deletedProduct = "";

            try {

                specificProduct = await productsModel.findOne({ code: code });

            } catch (error) {

                i = 101;
                console.log('error en delete (" /:pid "):', error)

            };

            if (specificProduct = "") {
                i = 101;
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: "No se ha encontrado un producto que posea esa id." });

            } else {

                deletedProduct = await productsModel.deleteOne({ code: code });

            };

        } while (i < 100);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ deletedProducts: "Productos eliminados con exito!" });

    }

}