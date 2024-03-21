import { config } from "../src/config/config.js";
import { cartsModel } from "../src/dao/models/carts.model.js";
import { productsModel } from "../src/dao/models/products.model.js";

import mongoose from "mongoose";

import Assert from 'assert'

import { describe, it } from "mocha";

await mongoose.connect(config.MONGO_URL, { dbName: config.DBNAME });

const assert = Assert.strict

describe("Test CartController, postCart & putCart function", function () {

    this.timeout(10000)

    it("Prueba postCart function", async function () {

        const products = [{ productId: "6570f316c29e3b0cc9ae1a3a", quantity: 10000 }, { productId: "6570f354c29e3b0cc9ae1a3b", quantity: 10000 }]

        let productsLength = products.length

        let resStatus = 0;

        let verified = "";

        for (let step = 0; step < productsLength; step++) {

            let productVerification = "";

            try {

                productVerification = await productsModel.find({ _id: products[step].productId }).lean();

            } catch (error) {

                assert.fail("error en post / verificacion de producto" + " " + error.message)

            };
            if (productVerification == "") {
                resStatus = 400;
                return verified = false;
            }

        };



        if (verified = true) {
            try {

                let newCart = await cartsModel.create({ products });

                resStatus = 200;

            } catch (error) {

                assert.fail("error en post / verificacion" + " " + error.message)

            };
        }


        assert.equal(resStatus, 200, "Carrito creado con éxito!")

        assert.ok(verified, "")
        assert.ok(typeof newCart, 'object')

    })

    it("Prueba putCart function a partir de un carrito de prueba", async function () {

        const { cid } = "65cd3c22d664d2019795fe87"

        let specificCart = "";

        let verified = ""

        let resStatus = 0;

        try {

            specificCart = await cartsModel.findOne({ products: cid });

        } catch (error) {

            assert.fail("error en put /:cid " + " " + error.message)

        };

        if (specificCart == "") {

            resStatus = 404;

        } else {

            let newProducts = [{ productId: "6570f316c29e3b0cc9ae1a3a", quantity: 50 }, { productId: "6570f354c29e3b0cc9ae1a3b", quantity: 50 }];

            for (let step = 0; step < newProducts.length; step++) {

                let productVerification = "";

                try {

                    productVerification = await productsModel.find({ _id: newProducts[step].productId }).lean();

                } catch (error) {

                    assert.fail("error en put /:cid / verificacion de producto" + " " + error.message)

                };
                if (productVerification == "") {
                    resStatus = 400;
                    return verified = false;
                }

            };



            if (verified = true) {

                let updateCart

                try {

                    updateCart = await cartsModel.updateOne({ _id: cid }, { $set: { "products": newProducts } })

                    resStatus = 200;
                } catch (error) {
                    assert.fail("error en put /:cid / verificacion " + " " + error.message)
                }

            };
        };


        assert.equal(resStatus, 200, "Carrito modificado con éxito!")

        assert.ok(verified, "")
        assert.ok(typeof updateCart, 'object')
        assert.ok(typeof specificCart, 'object')

    })

})


