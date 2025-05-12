import express from "express";
import authRouter from "./authRouter.js";
import eventRouter from "./eventRouter.js";
import guestRouter from "./guestRouter.js";
import statsRouter from "./statsRouter.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/event", eventRouter);

router.use("/guest", guestRouter);

router.use("/stats", statsRouter);

export default router;
