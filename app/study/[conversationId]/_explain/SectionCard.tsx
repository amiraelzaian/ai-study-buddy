// components/explain/SectionCard.tsx

import { BookOpen, KeyRound, Lightbulb, Sparkles } from "lucide-react";
import { isCodeBlock, isList, renderLine, type Section } from "./explain.utils";

const sectionIcons: Record<number, React.ReactNode> = {
  0: <Sparkles className="w-5 h-5 text-purple-500" />,
  1: <BookOpen className="w-5 h-5 text-purple-500" />,
  2: <KeyRound className="w-5 h-5 text-purple-500" />,
  3: <Lightbulb className="w-5 h-5 text-yellow-500" />,
};

type Props = {
  section: Section;
  index: number;
};

export default function SectionCard({ section, index }: Props) {
  const code = isCodeBlock(section.lines);
  const list = !code && isList(section.lines);
  const isFirst = index === 0;

  return (
    <div
      className={`rounded-2xl p-5 border ${
        isFirst
          ? "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30"
          : code
            ? "bg-gray-900 dark:bg-gray-950 border-gray-700"
            : "bg-card border-border"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        {sectionIcons[index] ?? (
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
              .map((l) => l.replace(/^```[a-z]*/, "").replace(/```$/, ""))
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
}
