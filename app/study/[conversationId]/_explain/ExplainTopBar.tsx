// components/explain/ExplainTopBar.tsx

import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExplainTopBar() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0 bg-background">
      <button
        onClick={() => router.push("/study")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-full">
        <Sparkles className="w-3.5 h-3.5" />
        AI Explanation
      </div>
      <div className="w-16" />
    </div>
  );
}
