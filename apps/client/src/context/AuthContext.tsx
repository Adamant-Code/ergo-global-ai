"use client";

// Component
import Loader from "@/components/Loader/Loader";

// Internal Deps
import apiClient from "@/lib/apiClient";
import { parseError } from "@/lib/errors";
import { useError } from "@/hooks/useError";
import { AuthContextType } from "@/types/auth-context";

// External dependencies
import {
  useState,
  useEffect,
  useCallback,
  createContext,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { AccessTokenResponse } from "@request-response/types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setError } = useError();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  // Handle initial loading
  useEffect(() => {
    if (status !== "loading") setIsLoading(false);
  }, [status]);

  // Sign out user if refresh token is invalid
  useEffect(() => {
    if (
      !session?.error ||
      session.error !== "RefreshAccessTokenError"
    )
      return;

    signOut({ redirect: false })
      .then(() => {
        setError(parseError("Session expired"));
      })
      .catch((err) => {
        console.error("Error during sign out:", err);
      });
  }, [session, setError]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const data = await apiClient.post<AccessTokenResponse>(
          `/auth/login`,
          { email, password }
        );

        const result = await signIn("credentials", {
          email,
          id: data.id,
          redirect: false,
          accessToken: data.accessToken,
        });

        if (result?.error) throw new Error(result.error);
      } catch (error) {
        setError(parseError(error));
        throw error;
      }
    },
    [setError]
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
      await signOut({ redirect: false });
    } catch (error) {
      setError(parseError(error));
      throw error;
    }
  }, [setError]);

  const register = useCallback(
    async (email: string, password: string) => {
      try {
        const data = await apiClient.post<AccessTokenResponse>(
          `/user/register`,
          { email, password }
        );
        const result = await signIn("credentials", {
          email,
          id: data.id,
          redirect: false,
          accessToken: data.accessToken,
        });

        if (result?.error) throw new Error(result.error);
      } catch (error) {
        setError(parseError(error));
        throw error;
      }
    },
    [setError]
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        await apiClient.post(`/auth/forgot-password`, {
          email,
        });
      } catch (error) {
        setError(parseError(error));
        throw error;
      }
    },
    [setError]
  );

  const resetPassword = useCallback(
    async (token: string, password: string) => {
      try {
        await apiClient.post(`/auth/reset-password`, {
          token,
          password,
        });
      } catch (error) {
        setError(parseError(error));
        throw error;
      }
    },
    [setError]
  );

  if (isLoading) return <Loader />;

  return (
    <AuthContext.Provider
      value={{
        login,
        status,
        logout,
        session,
        register,
        resetPassword,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
