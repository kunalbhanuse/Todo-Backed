import { Router } from "express";
import * as authController from "./auth.controller.js";
import { isLoggedIn } from "./auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/getMe", isLoggedIn, authController.getMe);
authRouter.post("/refreshToken", authController.refreshToken);

export default authRouter;
