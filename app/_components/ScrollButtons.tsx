"use client";
import { ArrowUp, ArrowDown } from "lucide-react";
import { usePathname } from "next/navigation";
// import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScrollButtons() {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const pathname = usePathname();
  const notDispaly =
    pathname.split("/")[1] === "login" || pathname.split("/")[1] === "signup";

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollBottom = window.innerHeight + scrollTop;
      const total = document.body.scrollHeight;

      setAtTop(scrollTop < 10);
      setAtBottom(scrollBottom >= total - 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {!notDispaly && (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            disabled={atTop}
            className="p-2 rounded-full border border-border bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
            disabled={atBottom}
            className="p-2 rounded-full border border-border bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
