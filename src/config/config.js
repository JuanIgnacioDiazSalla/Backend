import dotenv from "dotenv";

dotenv.config(
    {
        path: "./src/.env"
    }
)

export const config = {
    MONGO_URL: process.env.MONGO_URL,
    DBNAME: process.env.DBNAME,
    SECRET: process.env.SECRET,
    CLIENTID: process.env.CLIENTID,
    CLIENTSECRET: process.env.CLIENTSECRET,
    CALLBACKURL: process.env.CALLBACKURL
}