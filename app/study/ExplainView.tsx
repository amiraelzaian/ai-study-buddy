"use client";

import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  KeyRound,
} from "lucide-react";
import { saveStudySession } from "../_lib/actions";
import { useEffect } from "react";

type Props = {
  topic: string;
  content: string;
  userId: string;
  conversationId: string | null;
  onBack: () => void;
};

// Split AI plain text response into visual sections
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

  // If no sections parsed (single block), treat as overview
  if (sections.length === 0) {
    return [{ heading: "Overview", lines: lines }];
  }
  return sections;
}

function renderLine(line: string) {
  // Bold **text**
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

function ExplainView({
  topic,
  content,
  userId,
  conversationId,
  onBack,
}: Props) {
  const sections = parseSections(content);

  useEffect(() => {
    saveStudySession(userId, topic, "", "explain");
  }, [userId, topic]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
        <button
          onClick={onBack}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full space-y-4">
        <h1 className="text-3xl font-bold text-foreground">{topic}</h1>

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
              {/* Section heading */}
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

              {/* Content */}
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
              onClick={onBack}
              className="px-4 py-2 rounded-xl border-2 border-white text-white text-sm
                         font-semibold hover:bg-white hover:text-purple-700 transition-all
                         flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Take Quiz
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl border-2 border-purple-300 text-purple-100
                         text-sm font-semibold hover:bg-white/10 transition-all
                         flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              View Flashcards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplainView;
