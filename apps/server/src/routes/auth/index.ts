import express from "express";

// Auth routes
import loginRouter from "./login/index.js";
import logoutRouter from "./logout/index.js";
import revokeRouter from "./revokeToken/index.js";
import refreshTokenRouter from "./refreshToken/index.js";
import resetPasswordRouter from "./resetPassword/index.js";
import forgotPasswordRouter from "./forgotPassword/index.js";

const router = express.Router();

router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/revoke-token", revokeRouter);
router.use("/refresh-token", refreshTokenRouter);
router.use("/reset-password", resetPasswordRouter);
router.use("/forgot-password", forgotPasswordRouter);

export default router;
