import {
  FeatureType,
  CurrentAdmin,
  ResourceOptions,
  ResourceWithOptions,
} from "adminjs";
import loggerFeature, {
  LoggerPropertiesMapping,
} from "@adminjs/logger";
import * as bcrypt from "bcrypt";
import { User } from "@/models/User.js";
import passwordsFeature from "@adminjs/passwords";
import importExportFeature from "@adminjs/import-export";
import { componentLoader, Components } from "../componentLoader.js";

const userResource: ResourceWithOptions = {
  resource: User,
  features: [
    passwordsFeature({
      componentLoader,
      properties: {
        password: "newPassword",
        encryptedPassword: "password",
      },
      hash: (newPassword) => bcrypt.hash(newPassword, 10),
    }),
    loggerFeature({
      componentLoader,
      propertiesMapping: {
        user: "adminId",
      } as LoggerPropertiesMapping,
      userIdAttribute: "id",
    }) as FeatureType,
    importExportFeature({ componentLoader }),
  ],
  options: {
    editProperties: ["email", "newPassword"],
    navigation: { icon: "Folder", name: "User" },
    sort: { direction: "asc", sortBy: "createdAt" },
    filterProperties: ["email", "createdAt", "updatedAt"],
    showProperties: ["id", "email", "createdAt", "updatedAt"],
    listProperties: ["id", "email", "createdAt", "updatedAt"],

    actions: {
      list: {
        before: async (request) => {
          if (request?.query) request.query.perPage = 5;
          return request;
        },
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) =>
          currentAdmin?.role === "SUPER_ADMIN" ||
          currentAdmin?.role === "EDITOR" ||
          currentAdmin?.role === "VIEWER",
      },
      show: {
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) =>
          currentAdmin?.role === "SUPER_ADMIN" ||
          currentAdmin?.role === "EDITOR" ||
          currentAdmin?.role === "VIEWER",
      },
      edit: {
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) =>
          currentAdmin?.role === "SUPER_ADMIN" ||
          currentAdmin?.role === "EDITOR",
      },
      new: {
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) =>
          currentAdmin?.role === "SUPER_ADMIN" ||
          currentAdmin?.role === "EDITOR",
      },
      delete: {
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) =>
          currentAdmin?.role === "SUPER_ADMIN" ||
          currentAdmin?.role === "EDITOR",
      },
      bulkDelete: {
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) => currentAdmin?.role === "SUPER_ADMIN",
      },
    },

    properties: {
      password: {
        isVisible: {
          list: false,
          show: false,
          edit: true,
          filter: false,
        },
      },
      newPassword: {
        type: "password",
        isVisible: {
          list: false,
          show: false,
          edit: true,
          filter: false,
        },
        components: {
          edit: Components.EditPasswordProperty,
        },
      },
    },
  } as ResourceOptions,
};

export default userResource;
