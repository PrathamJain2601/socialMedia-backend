import express from "express";
import { Login, Register, Logout } from "../controllers/auth.controller.js";
import isAuthorised from "../middlewares/isAuthorised.js"

const router = express.Router();
router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", Logout);

export default router;