import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchema = new mongoose.Schema(
    {
        purchase_datatime: {
            type: Date,
            default: Date.now
        },
        amount: {
            type: Number,
            require: true
        },
        purchaser: {
            type: mongoose.Schema.Types.String,
            ref: 'users',
            require: true
        }
    },
    { strict: true }
);

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
