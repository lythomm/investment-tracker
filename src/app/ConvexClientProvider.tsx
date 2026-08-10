"use client";

import { ReactNode } from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

const convexClient = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy-deployment.convex.cloud"
);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider client={convexClient}>{children}</ConvexAuthProvider>;
}
