import mongoose from "mongoose";

import paginate from "mongoose-paginate-v2"

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema(
    {
        products: {
            type: [{
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    require: true
                },
                quantity: {
                    type: Number,
                    require: true
                }
            }],
            default: []
        },
        sold: {
            type: Boolean,
            default: false
        },
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tickets"
        }
    },
    { strict: false }
);

cartsSchema.plugin(paginate);


export const cartsModel = mongoose.model(cartsCollection, cartsSchema);