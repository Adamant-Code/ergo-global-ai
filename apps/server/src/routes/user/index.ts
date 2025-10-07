import express from "express";
import registerRouter from "./register/index.js";
import getSubscriptionRouter from "./subscription/index.js";

const router = express.Router();

router.post("/register", registerRouter);
router.use("/subscription", getSubscriptionRouter);

export default router;