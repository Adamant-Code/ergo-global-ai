// External Deps
import express from "express";
import { logoutSchema } from "@request-response/types";

// Internal Deps
import logout from "./logout.js";
import { verifyJWT } from "@/middleware/verifyJWT.js";
import { validateRequest } from "@/middleware/validateRequest.js";

const router = express.Router();

router.post("/", verifyJWT, validateRequest(logoutSchema), logout);

export default router;
