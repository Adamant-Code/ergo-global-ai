import express from "express";
import stripeWebhookRouter from "./webhook/index.js";
import stripeSubscriptionRouter from "./subscription/index.js";
import stripePortalSessionRouter from "./portalSession/index.js";

const router = express.Router();

router.use("/webhook", stripeWebhookRouter);

router.use(express.json());
router.use("/subscription", stripeSubscriptionRouter);
router.use("/portal-session", stripePortalSessionRouter);

export default router;