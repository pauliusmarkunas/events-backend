import express from "express";
import authRouter from "./authRouter.js";
import eventRouter from "./eventRouter.js";
import guestRouter from "./guestRouter.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/event", eventRouter);

router.use("/guest", guestRouter);

export default router;
