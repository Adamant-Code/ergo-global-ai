import express from "express";
import createPortalSession from "./create.js";
import { verifyJWT } from "@/middleware/verifyJWT.js";

const router = express.Router();

router.post("/create", verifyJWT, createPortalSession);

export default router;
