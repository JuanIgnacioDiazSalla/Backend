import { config } from "../src/config/config.js";
import { productsModel } from "../src/dao/models/products.model.js";

import mongoose from "mongoose";

import Assert from 'assert'

import { describe, it } from "mocha";

await mongoose.connect(config.MONGO_URL, { dbName: config.DBNAME });

const assert = Assert.strict

describe("Test ProductsController, postProduct & putProduct functions", function () {

    this.timeout(10000)

    afterEach(function () {
        this.timeout(500)
    })

    it("Prueba postProduct function", async function () {

        let title = "producto de prueba TEST";
        let description = "Description Test";
        let price = 3500;
        let thumbnail = [];
        let code = "TESTCODE001";
        let stock = 250;
        let category = "TESTCATEGORY001";
        let status = true;
        let owner = "65cd3c58d664d2019795fe8f";

        let resStatus = 0;

        let duplicateProduct = "";

        try {

            duplicateProduct = await productsModel.find({ code: code, }).lean();

        } catch (error) {

            assert.fail(error)

        };


        if (duplicateProduct == "" || duplicateProduct == null) {
            try {

                let newProduct = await productsModel.create({ title, description, price, thumbnail, code, stock, category, status, owner });
                resStatus = 200;

            } catch (error) {

                assert.fail(error)

            }

        } else {

            assert.fail("Producto duplicado" + duplicateProduct)
            resStatus = 400;
        };


        assert.equal(resStatus, 200, "Producto creado con éxito!")

        assert.ok(duplicateProduct, "")
        assert.ok(typeof newProduct, 'object')
    })

    it("Prueba putProduct function", async function () {

        const title = "producto de prueba TEST";
        const newTitle = "Producto Test ACTUALIZADO";
        let resStatus = 0;

        let specificId = "";

        let specificProduct = "";

        try {

            specificProduct = await productsModel.findOne({ title: title });

            specificId = specificProduct._id;

        } catch (error) {

            assert.fail("error en put / producto especifico" + " " + error.message)

        };

        if (specificProduct = "") {
            resStatus = 400;

        } else {

            let duplicateProduct = "";

            try {

                duplicateProduct = await productsModel.find({ title: newTitle }).lean();

            } catch (error) {

                assert.fail("error en put / producto duplicado" + " " + error.message)

            };


            if (duplicateProduct == "" || duplicateProduct == null) {

                try {

                    specificProduct = await productsModel.updateOne({ _id: specificId }, { $set: { "title": newTitle } });

                    resStatus = 200;
                } catch (error) {

                    assert.fail("error en put / acualizando producto" + " " + error.message)

                };

            } else {

                assert.fail("producto duplicado" + " " + duplicateProduct)

                resStatus = 400;

            };
        }

        assert.equal(resStatus, 200, "Producto modificado con éxito!")

        assert.ok(typeof duplicateProduct, null)
        assert.ok(typeof specificProduct, 'object')
    })

})




