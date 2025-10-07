import express from "express";
import userRouter from "./user/index.js";
import authRouter from "./auth/index.js";
import adminUser from "./admin/index.js";
import healthRouter from "./health/index.js";
import conversationRouter from "./conversation/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.status(200).json({ message: "This is home" });
});
router.use("/admin", adminUser);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/health", healthRouter);
router.use("/conversations", conversationRouter);

export default router;
