import { Session } from "next-auth";
import { AxiosResponse } from "axios";
import { AccessTokenResponse } from "@request-response/types";

export interface AuthContextType {
  session: Session | null;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  status: "authenticated" | "loading" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

export interface AxiosAuthResponse extends AxiosResponse {
  data: AccessTokenResponse;
}
