"use client";
import { Brain } from "lucide-react";
import Link from "next/link";
function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center gap-3 group cursor-pointer p-2">
        <div
          className="relative flex items-center justify-center w-10 h-10 rounded-xl 
        bg-gradient-to-br  from-primary-500 to-primary-800 shadow-lg
       shadow-primary-500/30 transition-transform duration-200 group-hover:scale-105"
        >
          <Brain className="w-5 h-5 text-white" />
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5
         bg-emerald-400 rounded-full border-2 
         border-background animate-pulse"
          />
        </div>

        <div className="flex flex-col leading-none">
          <span
            className="text-[14px] font-medium tracking-widest uppercase 
        text-muted-foreground"
          >
            AI
          </span>
          <span
            className="text-lg font-bold tracking-tight 
        bg-gradient-to-r from-primary-500 to-primary-800 
        bg-clip-text text-transparent"
          >
            Study Buddy
          </span>
        </div>
      </div>
    </Link>
  );
}

export default Logo;
