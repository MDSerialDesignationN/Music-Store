const express = require("express");
const AuthController = require("./auth.controller");
const { requireAuth, requireGuest } = require("../../../middleware/auth");

const authRouter = express.Router();

authRouter.post("/login", requireGuest, AuthController.login);
authRouter.get("/session", AuthController.getSession);
authRouter.post("/logout", requireAuth, AuthController.logout);


module.exports = authRouter;
