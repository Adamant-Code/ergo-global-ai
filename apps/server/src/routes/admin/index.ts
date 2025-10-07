import express from "express";
import { admin, auth } from "./admin.js";
import AdminJSExpress from "@adminjs/express";
import sessionOptions from "./config/session.js";

const router = express.Router();
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  auth,
  null,
  sessionOptions
);

router.use("/", adminRouter);

export default router;
