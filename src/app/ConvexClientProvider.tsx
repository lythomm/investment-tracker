"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy-deployment.convex.cloud";
  const convex = useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);

  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
