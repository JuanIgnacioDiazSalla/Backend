import { cartsModel } from "../dao/models/carts.model.js";
import { productsModel } from "../dao/models/products.model.js";
import { ticketsModel } from "../dao/models/tickets.model.js";
import { usersModel } from "../dao/models/users.model.js";

export class CartController {

    static async getCarts(req, res) {

        let { limit, page } = req.query;

        if (!page) {
            page = 1;
        } else {
            page = parseInt(page);
        };

        let cartsMDB = [];

        if (!limit) {
            try {

                cartsMDB = await cartsModel.paginate({}, { lean: true, page: page, populate: "products.productId" })

            } catch (error) {

                console.log('error en get ( "/" ) sin limite: ', error);

            };

            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = cartsMDB;

            res.status(200).json({ status: "success", payload: cartsMDB.docs, limit: 10, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage });

        } else {

            try {

                cartsMDB = await cartsModel.paginate({}, { lean: true, page: page, populate: true, limit: limit, populate: "products.productId" })

            } catch (error) {

                console.log('error en get ( "/" ) con limite: ', error);

            };

            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = cartsMDB;

            res.status(200).json({ status: "success", payload: cartsMDB.docs, limit: limit, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage });

        };

    }

    static async getSpecificCart(req, res) {

        let cartId = req.params.cid;

        let specificCart = [];

        try {

            specificCart = await cartsModel.findOne({ _id: cartId });

        } catch (error) {

            req.Logger.error("error en get /:cid" + " " + error.message)

        };


        res.status(200).json({ specificCart });

    }

    static async postCart(req, res) {

        const { products } = req.body

        let productsLength = products.length

        let verified = "";

        for (let step = 0; step < productsLength; step++) {

            let productVerification = "";

            try {

                productVerification = await productsModel.find({ _id: products[step].productId }).lean();

                req.Logger.info(" product verification " + " " + productVerification)

            } catch (error) {

                req.Logger.error("error en post / verificacion de producto" + " " + error.message)

            };
            if (productVerification == "") {
                res.setHeader('Content-Type', 'application/json')
                res.status(400).json({ error: "Faltan propiedades para poder agregar el carrito!" })
                return verified = false;
            }

        };



        if (verified = true) {
            try {

                let newCart = await cartsModel.create({ products });

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ newCart: newCart });

            } catch (error) {

                req.Logger.error("error en post / verificacion" + " " + error.message)

            };
        }

    }

    static async postProductToCart(req, res) {

        let { cid, pid } = req.params

        let specificCart = "";

        try {

            specificCart = await cartsModel.findOne({ _id: cid });

        } catch (error) {

            req.Logger.error("error en post /:cid" + " " + error.message)

        };

        if (specificCart == "") {

            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: "El Carrito no existe." });

        } else {

            const { quantity } = req.body

            let productVerification = "";

            try {

                productVerification = await productsModel.find({ _id: pid }).lean();

                req.Logger.info(" product verification " + " " + productVerification)

            } catch (error) {

                req.Logger.error("error en post /:cid / verificacion de producto" + " " + error.message)

            };



            if (productVerification == "") {
                res.setHeader('Content-Type', 'application/json')
                res.status(400).json({ error: "Faltan propiedades para poder agregar el carrito!" })
            } else {

                let index = specificCart.products.findIndex((element) => element.productId = pid)

                console.log("index = ", index)

                if (index == -1) {

                    try {
                        let updateCart = await cartsModel.findOneAndUpdate({ _id: cid }, { $push: { "products": { "productId": pid, "quantity": quantity } } })
                    } catch (error) {
                        req.Logger.error("error en post /:cid / carrito especifico" + " " + error.message)
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ updatedCart2: updateCart });

                } else {

                    try {
                        let updateCart = await cartsModel.updateOne({ _id: cid, "products.productId": pid }, { $inc: { "products.$.quantity": quantity } })
                    } catch (error) {
                        req.Logger.error("error en post /:cid / carrito especifico" + " " + error.message)
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ updatedCart1: updateCart });

                }


            };
        };


    }

    static async putProductInCart(req, res) {

        let { cid, pid } = req.params

        let specificCart = "";

        try {

            specificCart = await cartsModel.findOne({ _id: cid });

        } catch (error) {

            req.Logger.error("error en put /:cid/products/:pid" + " " + error.message)

        };

        if (specificCart == "") {

            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: "El Carrito no existe." });

        } else {

            const { quantity } = req.body

            let productVerification = "";

            try {

                productVerification = await productsModel.find({ _id: pid }).lean();

                req.Logger.info(" product verification " + " " + productVerification)

            } catch (error) {

                req.Logger.error("error en put /:cid/products/:pid / verificacion de producto" + " " + error.message)

            };



            if (productVerification == "") {
                res.setHeader('Content-Type', 'application/json')
                res.status(400).json({ error: "Faltan propiedades para poder modificar el carrito!" })
            } else {

                let index = specificCart.products.findIndex((element) => element.productId = pid)

                console.log("index = ", index)

                if (index == -1) {

                    res.setHeader('Content-Type', 'application/json');
                    res.status(400).json({ error: "No se ha encontrado el producto a modificar" });

                } else {

                    let updateCart = await cartsModel.updateOne({ _id: cid, "products.productId": pid }, { $set: { "products.$.quantity": quantity } })

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ updatedCart1: updateCart });

                }


            };
        };


    }

    static async putCart(req, res) {

        let { cid } = req.params;

        let specificCart = "";

        try {

            specificCart = await cartsModel.findOne({ _id: cid });

        } catch (error) {

            req.Logger.error("error en put /:cid " + " " + error.message)

        };

        if (specificCart == "") {

            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: "El Carrito no existe." });

        } else {

            let { newProducts } = req.body;

            console.log(newProducts, specificCart)

            let verified = ""

            for (let step = 0; step < newProducts.length; step++) {

                let productVerification = "";

                try {

                    productVerification = await productsModel.find({ _id: newProducts[step].productId }).lean();

                    req.Logger.info(" product verification " + " " + productVerification)

                } catch (error) {

                    req.Logger.error("error en put /:cid / verificacion de producto" + " " + error.message)

                };
                if (productVerification == "") {
                    res.setHeader('Content-Type', 'application/json')
                    res.status(400).json({ error: "Faltan propiedades para poder agregar el carrito!" })
                    return verified = false;
                }

            };



            if (verified = true) {

                let updateCart

                try {

                    updateCart = await cartsModel.updateOne({ _id: cid }, { $set: { "products": newProducts } })

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ updatedCart2: updateCart });
                } catch (error) {
                    req.Logger.error("error en put /:cid / verificacion " + " " + error.message)
                }

            };
        };

    }

    static async deleteCart(req, res) {

        let { cid } = req.params;

        let specificCart = "";

        let deletedCart = "";

        try {

            specificCart = await cartsModel.findOne({ _id: cid });

        } catch (error) {

            req.Logger.error("error en delete /:cid  " + " " + error.message)

        };

        if (specificCart = "") {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: "No se ha encontrado un carrito que posea esa id." });

        } else {

            deletedCart = await cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ deletedCart: deletedCart });
        };
    }

    static async deleteProductFromCart(req, res) {

        let { cid, pid } = req.params;

        let specificCart = "";

        try {

            specificCart = await cartsModel.findOne({ _id: cid });

        } catch (error) {

            req.Logger.error("error en delete /:cid/products/:pid  " + " " + error.message)

        };

        let deletedProduct = "";

        if (specificCart == "") {

            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: "El Carrito no existe." });

        } else {

            try {

                deletedProduct = await productsModel.findOne({ _id: pid });

            } catch (error) {

                req.Logger.error("error en delete /:cid/products/:pid / eliminando producto " + " " + error.message)

            };

            if (deletedProduct = "") {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: "No se ha encontrado un producto que posea esa id." });

            } else {

                let updateCart

                try {

                    updateCart = await cartsModel.updateOne({ _id: cid }, { $pull: { "products": { "productId": pid } } });

                } catch (error) {

                    req.Logger.error("error en delete /:cid/products/:pid / actualizando carrito  " + " " + error.message)

                }

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ updatedCart1: updateCart });


            };
        }
    }



    static async cartSold(req, res) {

        let { cid } = req.params

        let notBuiedProducts = [];

        let moneySpent = 0;

        let specificCart = "";

        try {

            specificCart = await cartsModel.findOne({ _id: cid });

        } catch (error) {

            req.Logger.error("error en put /:cid/purchase / carrito especifico " + " " + error.message)

        };

        if (specificCart == "") {

            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: "El Carrito no existe." });

        } else {

            let productsArray = specificCart.products;

            for (const product of productsArray) {

                let id = product.productId;

                let quantity = parseInt(product.quantity); //Productos a comprar

                req.Logger.info("quantity" + " " + quantity)

                let productVerification = "";

                try {

                    productVerification = await productsModel.find({ _id: id }).lean();

                    req.Logger.info(" product verification " + " " + productVerification)

                } catch (error) {

                    req.Logger.error("error en put /:cid/purchase / verificacion de producto " + " " + error.message)

                };

                if (productVerification == "") {
                    res.setHeader('Content-Type', 'application/json')
                    res.status(400).json({ error: "Producto no encontrado!!" })
                } else {

                    let stock = parseInt(productVerification[0].stock);

                    req.Logger.info("stock" + " " + stock + " " + productVerification[0].stock)

                    let newStock = parseInt(stock - quantity);

                    req.Logger.info("newStock" + " " + newStock)

                    if (newStock > 0 || newStock == 0) {
                        //cambiar stock de products
                        try {
                            let stockProduct = await productsModel.updateOne({ _id: id }, { $set: { "stock": newStock } });
                            req.Logger.info("stockProduct: " + " " + stockProduct);
                        } catch (error) {
                            req.Logger.error("error en put /:cid/purchase / Stock 1 " + " " + error.message)
                        }

                        // dinero necesario para comprar

                        let moneyNeeded = parseInt(productVerification[0].price) * parseInt(quantity);

                        req.Logger.info("moneyNeeded" + " " + moneyNeeded)

                        moneySpent = parseInt(moneySpent + moneyNeeded);

                        req.Logger.info("moneySpent" + " " + moneySpent)

                    } else {

                        //cambiar stock de products y modificar array de productos no comprados

                        let noStock = parseInt(quantity - stock); //productos sobrantes para que el stock del producto quede en 0

                        try {
                            let stockProduct = await productsModel.updateOne({ _id: id }, { $set: { "stock": 0 } });
                            req.Logger.info("stockProduct: " + " " + stockProduct);
                        } catch (error) {
                            req.Logger.error("error en put /:cid/purchase / Stock 2 " + " " + error.message)
                        }

                        let productCannotBuy = { productId: id, quantity: noStock };

                        notBuiedProducts.push(productCannotBuy);

                        // dinero necesario para comprar

                        let moneyNeeded = parseInt(productVerification[0].price) * stock;

                        req.Logger.info("moneyNeeded" + " " + moneyNeeded)

                        moneySpent = parseInt(moneySpent + moneyNeeded);

                        req.Logger.info("moneySpent" + " " + moneySpent)

                    }

                }

            }

            // creo ticket

            let newTicket

            let userEmail

            try {   //busco email

                userEmail = await usersModel.findOne({ cart: cid })
            } catch (error) {
                req.Logger.error("error en put /:cid/purchase / userEmail " + " " + error.message)
            }

            let purchaserEmail = userEmail.email;

            try {

                newTicket = await ticketsModel.create({ amount: moneySpent, purchaser: purchaserEmail })

            } catch (error) {
                req.Logger.error("error en put /:cid/purchase / newTicket " + " " + error.message)
            }

            // devuelvo array con productos no comprados o vacio

            let cartSelled

            try {

                cartSelled = await cartsModel.updateOne({ _id: cid }, { $set: { products: notBuiedProducts, sold: true, ticketId: newTicket._id } })

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ cart: cartSelled });
            } catch (error) {
                req.Logger.error("error en put /:cid/purchase / cartSelled " + " " + error.message)
            }



        }
    }

}