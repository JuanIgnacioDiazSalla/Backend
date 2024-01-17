import mongoose from 'mongoose'

const usersCollection = 'users';

const usersSchema = new mongoose.Schema(
    {
        //   <modificado>
        first_name: {
            type: String,
            require: true
        },
        last_name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        age: {
            type: Number,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "carts",
            require: true
        },
        //   </modificado>
        rol: {
            type: String,
            default: "usuario"
        }

    }
);

export const usersModel = mongoose.model(usersCollection, usersSchema);

/*
{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    require: true
                }
*/