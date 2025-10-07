import NextAuth from "next-auth";
import { cookies } from "next/headers";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "id" },
        email: { label: "Email", type: "email" },
        accessToken: { label: "Access Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (
            !credentials?.id ||
            !credentials?.email ||
            !credentials?.accessToken
          )
            return null;

          return {
            id: credentials.id,
            email: credentials.email,
            accessToken: credentials.accessToken,
          };
        } catch (err) {
          if (err instanceof Error) throw err;
          throw new Error("Unexpected error during login");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        return token;
      }

      if (Date.now() < token.accessTokenExpires) return token;

      // Don't try to refresh if we've recently failed
      if (
        token.lastRefreshAttempt &&
        Date.now() - token.lastRefreshAttempt < 30000 // 30 seconds
      )
        return token;

      const cookieStore = cookies();
      const refreshToken = cookieStore.get("refreshToken")?.value;

      if (refreshToken && token.accessToken) {
        try {
          token.lastRefreshAttempt = Date.now();
          const res = await fetch(
            `${process.env.API_URL}/auth/refresh-token`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                Cookie: `refreshToken=${refreshToken}`,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            token.accessToken = data.accessToken;
            token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
            delete token.error;
          } else {
            token.error = "RefreshAccessTokenError";
          }
        } catch (err) {
          console.error("Failed to refresh token", err);
          token.error = "RefreshAccessTokenError";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.error) session.error = token.error;

      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
        session.accessTokenExpires = token.accessTokenExpires;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: {
    updateAge: 0,
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60 /** 7 days on seconds*/,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
