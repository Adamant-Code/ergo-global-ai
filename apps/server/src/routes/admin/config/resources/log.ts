import {
  createLoggerResource,
  LoggerResourceOptions,
} from "@adminjs/logger";
import { Log } from "@/models/Log.js";
import { ResourceWithOptions } from "adminjs";
import { componentLoader, Components } from "../componentLoader.js";

const baseLog: ResourceWithOptions = createLoggerResource({
  componentLoader,
  resource: Log,
  featureOptions: {
    userIdAttribute: "id",
    propertiesMapping: {
      user: "adminId",
      recordTitle: "recordTitle",
    },
    resourceOptions: {
      actions: {
        list: {
          before: async (request) => {
            if (request?.query) request.query.perPage = 5;
            return request;
          },
        },
      },
      navigation: {
        icon: "Search",
        name: "Audit Trail",
      },
    } as LoggerResourceOptions,
    componentLoader,
  },
});

const logResource: ResourceWithOptions = {
  ...baseLog,
  options: {
    ...baseLog.options,
    properties: {
      ...baseLog.options.properties,
      recordId: {
        isVisible: {
          list: true,
          show: true,
        },
        components: {
          edit: Components.ListRecordLinkProperty,
        },
        reference: "User",
      },
      adminId: {
        reference: "AdminUser",
      },

      difference: {
        isVisible: {
          list: false,
          show: true,
          edit: false,
          filter: false,
        },
        components: {
          show: Components.DifferenceRecordProperty,
        },
        type: "mixed",
      },
    },
  },
};

export default logResource;
