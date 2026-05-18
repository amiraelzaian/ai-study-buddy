"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function Theme() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full w-[34px] h-[34px] hover:scale-105
      shadow-md flex justify-center items-center bg-card"
      aria-label="Toggle theme"
    >
      {!mounted ? null : resolvedTheme === "dark" ? (
        <Moon className="text-blue-500" />
      ) : (
        <Sun className="text-yellow-400" />
      )}
    </button>
  );
}

export default Theme;
