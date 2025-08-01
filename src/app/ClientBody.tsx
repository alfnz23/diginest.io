"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    if (typeof window !== "undefined" && document.body) {
      document.body.className = "antialiased";
    }
  }, []);

  return <div className="antialiased">{children}</div>;
}
