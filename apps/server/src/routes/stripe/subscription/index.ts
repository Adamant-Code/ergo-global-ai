import express from "express";
import createSubscription from "./create.js";
import { verifyJWT } from "@/middleware/verifyJWT.js";

const router = express.Router();

router.post("/create", verifyJWT, createSubscription);

export default router;
