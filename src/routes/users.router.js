import { Router } from "express";
import { UsersController } from "../controller/users.controller.js";

const router = Router();

router.put('/premium/:uid', UsersController.UsersToPremium);

export default router;