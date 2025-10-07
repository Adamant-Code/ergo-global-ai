import {
  FeatureType,
  CurrentAdmin,
  ResourceOptions,
  ResourceWithOptions,
} from "adminjs";
import * as bcrypt from "bcrypt";
import loggerFeature from "@adminjs/logger";
import passwordsFeature from "@adminjs/passwords";
import { AdminUser } from "@/models/AdminUser.js";
import importExportFeature from "@adminjs/import-export";
import { componentLoader, Components } from "../componentLoader.js";

const adminResource: ResourceWithOptions = {
  resource: AdminUser,
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
      },
      userIdAttribute: "id",
    }) as FeatureType,
    importExportFeature({ componentLoader }),
  ],
  options: {
    titleProperty: "email",
    editProperties: ["email", "role", "newPassword"],
    sort: { direction: "desc", sortBy: "role" },
    navigation: { icon: "User", name: "Administration" },
    filterProperties: [
      "id",
      "email",
      "role",
      "createdAt",
      "updatedAt",
    ],
    listProperties: ["id", "role", "email", "createdAt", "updatedAt"],
    showProperties: ["id", "role", "email", "createdAt", "updatedAt"],

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
          currentAdmin?.role === "EDITOR",
      },
      new: {
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) => currentAdmin?.role === "SUPER_ADMIN",
      },
      show: {
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) =>
          currentAdmin?.role === "SUPER_ADMIN" ||
          currentAdmin?.role === "EDITOR",
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
      delete: {
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) => currentAdmin?.role === "SUPER_ADMIN",
      },
      bulkDelete: {
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) => currentAdmin?.role === "SUPER_ADMIN",
      },
      search: {
        isAccessible: ({
          currentAdmin,
        }: {
          currentAdmin?: CurrentAdmin;
        }) => currentAdmin?.role === "SUPER_ADMIN",
      },
    },

    properties: {
      email: {
        isTitle: true,
        isVisible: {
          list: true,
          show: true,
          edit: true,
          filter: true,
        },
      },
      password: {
        isVisible: {
          list: false,
          show: false,
          edit: false,
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
      role: {
        isVisible: {
          list: true,
          show: true,
          edit: true,
          filter: true,
        },
      },
      id: {
        isVisible: {
          list: true,
          show: true,
          edit: false,
          filter: true,
        },
      },
      createdAt: {
        isVisible: {
          list: true,
          show: true,
          edit: false,
          filter: true,
        },
      },
      updatedAt: {
        isVisible: {
          list: true,
          show: true,
          edit: false,
          filter: true,
        },
      },
    },
  } as ResourceOptions,
};

export default adminResource;
