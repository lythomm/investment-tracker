"use client";

import * as React from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const [convex] = React.useState(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy-deployment.convex.cloud")
  );

  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
