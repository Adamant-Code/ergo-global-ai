import "@/styles/globals.css";

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "./providers/ErrorBoundary";
import { ErrorProvider } from "@/context/ErrorContext";
import { SessionProvider } from "./providers/SessionProvider";
import ToastErrorNotifier from "@/components/Error/ToastErrorNotifier";

export const metadata: Metadata = {
  title: "Template",
  description:
    "This is a template application built with Next.js, TypeScript, and React. It serves as a starting point for building modern web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ErrorProvider>
            <ErrorBoundary>
              <AuthProvider>
                <Toaster
                  position="top-right"
                  reverseOrder={false}
                />
                <ToastErrorNotifier />
                {children}
              </AuthProvider>
            </ErrorBoundary>
          </ErrorProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
