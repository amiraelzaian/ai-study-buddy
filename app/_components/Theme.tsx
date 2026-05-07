"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

function Theme() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full w-[34px] h-[34px] hover:scale-105
      shadow-md flex justify-center items-center bg-gray-100"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {resolvedTheme === "dark" ? (
        <Moon className="text-blue-500" />
      ) : (
        <Sun className="text-yellow-400" />
      )}
    </button>
  );
}

export default Theme;
