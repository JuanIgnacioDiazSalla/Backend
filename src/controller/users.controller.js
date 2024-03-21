import { usersModel } from "../dao/models/users.model.js";

export class UsersController {

    static async UsersToPremium(req, res) {

        let uid = req.params.uid;

        req.Logger.info("entre" + uid)

        let specificUser

        try {

            specificUser = await usersModel.findByID(uid)

        } catch (error) {
            req.Logger.error("error get ' /premium/:uid ' / specific user / " + error.message + specificUser)
        }

        if (specificUser != "" || specificUser != null) {

            let modifiedUser

            try {

                modifiedUser = await usersModel.findOneAndUpdate({ _id: uid }, { $set: { rol: "premium" } })

            } catch (error) {
                req.Logger.error("error get ' /premium/:uid ' / modified user / " + error.message + modifiedUser)
            }

            res.status(200).json({ modifiedUser: modifiedUser })

        } else {
            req.Logger.info("Usuario con id" + " " + uid + " " + "no fue encontrado")

            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({ error: "El usuario que intenta buscar no fue encontrado" })
        }
    }
}

