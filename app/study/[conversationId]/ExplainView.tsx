"use client";

import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  KeyRound,
  Send,
} from "lucide-react";
import { saveStudySession } from "../../_lib/actions";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

type Props = {
  topic: string;
  content: string;
  userId: string;
  conversationId: string;
  messages: Message[];
};

function parseSections(raw: string) {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const sections: { heading: string; lines: string[] }[] = [];
  let current: { heading: string; lines: string[] } | null = null;

  for (const line of lines) {
    const isHeading =
      /^#{1,3}\s/.test(line) ||
      /^\*\*[^*]+\*\*$/.test(line) ||
      /^[A-Z][^.!?]{2,40}:$/.test(line);

    if (isHeading) {
      if (current) sections.push(current);
      current = {
        heading: line
          .replace(/^#{1,3}\s/, "")
          .replace(/\*\*/g, "")
          .replace(/:$/, ""),
        lines: [],
      };
    } else if (current) {
      current.lines.push(line);
    } else {
      current = { heading: "Overview", lines: [line] };
    }
  }
  if (current) sections.push(current);
  if (sections.length === 0) return [{ heading: "Overview", lines: lines }];
  return sections;
}

function renderLine(line: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") ? (
      <strong key={i} className="text-foreground font-semibold">
        {p.replace(/\*\*/g, "")}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function isCodeBlock(lines: string[]) {
  return lines.some(
    (l) =>
      l.startsWith("```") ||
      l.startsWith("    ") ||
      /^(function|const|let|var|import|class|def |<)/.test(l),
  );
}

function isList(lines: string[]) {
  return lines.every((l) => /^[-*•\d.]/.test(l));
}

const sectionIcons: Record<number, React.ReactNode> = {
  0: <Sparkles className="w-5 h-5 text-purple-500" />,
  1: <BookOpen className="w-5 h-5 text-purple-500" />,
  2: <KeyRound className="w-5 h-5 text-purple-500" />,
  3: <Lightbulb className="w-5 h-5 text-yellow-500" />,
};

export default function ExplainView({
  topic,
  content,
  userId,
  conversationId,
  messages: initialMessages,
}: Props) {
  const sections = parseSections(content);
  const router = useRouter();
  const [chatMessages, setChatMessages] = useState(
    initialMessages.filter((m) => m.role !== "model" || m.content !== content),
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function save() {
      await saveStudySession(userId, conversationId, topic, "", "explain");
      router.refresh();
    }
    save();
  }, [userId, topic, conversationId, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  async function handleSend() {
    if (!input.trim() || sending) return;
    const question = input.trim();
    setInput("");
    setSending(true);

    // Optimistically add user message
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: question,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          subject: topic,
          mode: "explain",
          userId,
          conversationId,
        }),
      });

      const data = await res.json();

      if (data.answer) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "model",
            content: data.answer,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setChatMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full space-y-4">
        <h1 className="text-3xl font-bold text-foreground">{topic}</h1>

        {/* Explanation sections */}
        {sections.map((section, i) => {
          const code = isCodeBlock(section.lines);
          const list = !code && isList(section.lines);
          const isFirst = i === 0;
          return (
            <div
              key={i}
              className={`rounded-2xl p-5 border ${
                isFirst
                  ? "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30"
                  : code
                    ? "bg-gray-900 dark:bg-gray-950 border-gray-700"
                    : "bg-card border-border"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {sectionIcons[i] ?? (
                  <BookOpen className="w-5 h-5 text-purple-500" />
                )}
                <h2
                  className={`text-base font-semibold ${code ? "text-white" : "text-foreground"}`}
                >
                  {section.heading}
                </h2>
              </div>
              {code ? (
                <pre className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
                  <code className="text-green-300 text-xs font-mono leading-relaxed">
                    {section.lines
                      .map((l) =>
                        l.replace(/^```[a-z]*/, "").replace(/```$/, ""),
                      )
                      .join("\n")
                      .trim()}
                  </code>
                </pre>
              ) : list ? (
                <ol className="space-y-2">
                  {section.lines.map((line, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center justify-center mt-0.5">
                        {j + 1}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {renderLine(line.replace(/^[-*•\d.]+\s*/, ""))}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="space-y-2">
                  {section.lines.map((line, j) => (
                    <p
                      key={j}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      {renderLine(line)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-1">
            Ready to test your knowledge?
          </h2>
          <p className="text-purple-200 text-sm mb-5">
            Take a quiz or review flashcards to reinforce what you&apos;ve
            learned.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push("/study")}
              className="px-4 py-2 rounded-xl border-2 border-white text-white text-sm font-semibold hover:bg-white hover:text-purple-700 transition-all flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Take Quiz
            </button>
            <button
              onClick={() => router.push("/study")}
              className="px-4 py-2 rounded-xl border-2 border-purple-300 text-purple-100 text-sm font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              View Flashcards
            </button>
          </div>
        </div>

        {/* Follow-up chat messages */}
        {chatMessages
          .filter((m) => m.role === "user" || m.content !== content)
          .map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl p-4 border ${
                m.role === "user"
                  ? "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30 ml-8"
                  : "bg-card border-border"
              }`}
            >
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                {m.role === "user" ? "You" : "AI"}
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {m.content}
              </p>
            </div>
          ))}

        <div ref={bottomRef} />
      </div>

      {/* Chat input */}
      <div className="flex-shrink-0 border-t border-border px-6 py-4 bg-background">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a follow-up question..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-purple-400
                       transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-white transition-all flex items-center gap-2"
          >
            {sending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
