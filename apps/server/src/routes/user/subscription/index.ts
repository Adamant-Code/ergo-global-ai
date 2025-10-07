// External Deps
import express from "express";

// Internal Deps
import getSubscription from "./subscription.js";
import { verifyJWT } from "@/middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getSubscription);

export default router;
