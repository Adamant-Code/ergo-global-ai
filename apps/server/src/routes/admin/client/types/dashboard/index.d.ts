import { Request } from "express";
import { IconProps } from "@adminjs/design-system";

// interface JobData {
//   data: any;
//   id: string;
//   name: string;
//   timestamp: number;
//   returnvalue?: any;
//   finishedOn?: number;
//   stacktrace?: string;
//   attemptsMade: number;
//   processedOn?: number;
//   failedReason?: string;
// }

// This is where you can define the
// shape of data expected from the
// dashboardHander.ts
export interface DashboardData {
  // queue?: {
  //   total: number;
  //   active: number;
  //   error?: string;
  //   failed: number;
  //   waiting: number;
  //   delayed: number;
  //   completed: number;
  // };
  // pdfs?: {
  //   total: number;
  //   error?: string;
  //   files: Array<{
  //     name: string;
  //     size: number;
  //     created: string;
  //     modified: string;
  //   }>;
  // };
  // activeJobs?: Array<JobData> | { error: string };
  // failedJobs?: Array<JobData> | { error: string };
  // completedJobs?: Array<JobData> | { error: string };
  message?: string;
  activeJobs?: number;
  failedJobs?: number;
  completedJobs?: number;
  pdfs?: {
    total?: number;
    processed?: number;
    pending?: number;
  };
  queue?: {
    items?: number;
  };
  lastUpdated?: string;
  error?: string;
}

export interface StatCardProps {
  label: string;
  icon: IconProps;
  iconColor?: string;
  value: number | string | undefined | null;
}

export interface AdminJSRequest extends Request {
  method: string;
  url: string;
  originalUrl: string;

  params: Record<string, any>;
  query: {
    perPage?: number;
    page?: number;
    direction?: "asc" | "desc";
    sortBy?: string;
    filters?: Record<string, any>;
    [key: string]: any;
  };

  payload?: Record<string, any>;

  headers: Record<string, string>;
  session?: {
    adminUser?: {
      id: string | number;
      email?: string;
      role?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };

  resource?: {
    id: string;
    name: string;
    [key: string]: any;
  };

  cookies?: Record<string, string>;
  ip?: string;
}
