import express from "express";
import { register } from "../controllers/authController.js";
// import { authUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// register
router.post("/register", register);

// router.post("/login", validateLoginBody, login);

// router.post("/logout", logout);

// router.get("/me", authUser, getUserInfo);

export default router;
