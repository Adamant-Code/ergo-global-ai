import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    };
    accessToken: string;
    error?: string;
    accessTokenExpires: number;
  }

  interface User {
    id: string;
    email: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    error?: string;
    accessToken: string;
    accessTokenExpires: number;
    lastRefreshAttempt: number;
  }
}
