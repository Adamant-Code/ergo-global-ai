"use client";

import { ReactNode } from "react";
import { SessionProvider as SessProvider } from "next-auth/react";

export function SessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <SessProvider>{children}</SessProvider>;
}
