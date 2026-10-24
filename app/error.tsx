"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <AlertTriangle className="size-7" />
      </div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
        Something went wrong
      </h1>
      <p className="text-xs text-muted-foreground max-w-md mb-6">
        An unexpected error occurred while loading this page. You can try
        refreshing the connection.
      </p>

      <div className="flex gap-3">
        <Button onClick={() => reset()} variant="outline" size="sm">
          <RefreshCw className="size-3.5 mr-1.5" /> Try Again
        </Button>
        <Link
          href="/"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          <ArrowLeft className="size-3.5 mr-1.5" /> Return Home
        </Link>
      </div>
    </div>
  );
}
