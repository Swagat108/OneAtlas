"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global route error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-6">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground">
        An unexpected error occurred while rendering this view: {error.message || "Unknown error."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => reset()} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go to Home
        </Button>
      </div>
    </div>
  );
}
