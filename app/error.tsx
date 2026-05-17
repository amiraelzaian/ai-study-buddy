"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

type Props = {
  error: Error;
  reset: () => void;
};

function ErrorPage({ reset }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-center px-4">
      <AlertTriangle className="w-10 h-10 text-red-500" />
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground text-sm">
        An unexpected error occurred.
      </p>
      <div className="flex gap-2 mt-1">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm"
        >
          Try again
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded-xl border border-border text-sm"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
