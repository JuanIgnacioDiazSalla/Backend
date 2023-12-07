import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema(
    {
        products: [{
            productId: {
                type: String,
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }]
    },
    { strict: false }
);

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);