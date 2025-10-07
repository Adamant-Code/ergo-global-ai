// External Deps
import "dotenv/config";
import { Database, Resource } from "@adminjs/objection";
import { AuthenticationOptions } from "@adminjs/express";
import AdminJS, { Assets, ResourceOptions } from "adminjs";

// Internal Deps
import {
  Components,
  componentLoader,
} from "./config/componentLoader.js";
import logResource from "./config/resources/log.js";
import authenticate from "./utils/authentication.js";
import userResource from "./config/resources/user.js";
import adminResource from "./config/resources/admin.js";
import { dashboardHandler } from "./client/components/Dashboard/dashboardHandler.js";

AdminJS.registerAdapter({ Database, Resource });
const assetsOptions: Assets = {
  styles: ["/styles/table.css", "/styles/login.css"],
};
export const admin: AdminJS = new AdminJS({
  assets: assetsOptions,
  env: { NODE_ENV: process.env.NODE_ENV! },
  componentLoader,

  branding: {
    companyName: "Template",
    withMadeWithLove: false,
    logo: "/images/logo.png",
  },
  dashboard: {
    handler: dashboardHandler,
    component: Components.Dashboard,
  },
  resources: [
    adminResource,
    userResource,
    logResource,
  ] as ResourceOptions[],
});

admin.watch();

export const auth: AuthenticationOptions = {
  authenticate,
  cookieName: "adminjs",
  cookiePassword: process.env.ADMINJS_COOKIE_PASSWORD || "",
};
