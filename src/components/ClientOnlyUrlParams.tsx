"use client";

import { useEffect } from "react";

interface ClientOnlyUrlParamsProps {
  onCategoryChange: (category: string) => void;
}

export function ClientOnlyUrlParams({
  onCategoryChange,
}: ClientOnlyUrlParamsProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // This will only run on the client side after hydration
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (category) {
      onCategoryChange(category);
    }
  }, [onCategoryChange]);

  return null; // This component doesn't render anything
}
