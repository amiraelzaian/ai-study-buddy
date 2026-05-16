// components/explain/ChatMessage.tsx

import { isCodeBlock, isList, parseSections, renderLine, type Message } from "./explain.utils";

type Props = {
  message: Message;
};

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`rounded-2xl p-4 border ${
        isUser
          ? "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30 ml-8"
          : "bg-card border-border"
      }`}
    >
      <p className="text-xs font-semibold text-muted-foreground mb-1">
        {isUser ? "You" : "AI"}
      </p>

      <div className="space-y-3">
        {parseSections(message.content).map((section, index) => {
          const code = isCodeBlock(section.lines);
          const list = !code && isList(section.lines);

          return (
            <div key={index}>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {section.heading}
              </h3>

              {code ? (
                <pre className="overflow-x-auto rounded-xl bg-gray-900 p-4">
                  <code className="text-xs leading-relaxed text-green-300">
                    {section.lines.join("\n")}
                  </code>
                </pre>
              ) : list ? (
                <ol className="space-y-2">
                  {section.lines.map((line, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span>{i + 1}.</span>
                      <span>{renderLine(line.replace(/^[-*•\d.]+\s*/, ""))}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="space-y-2">
                  {section.lines.map((line, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                      {renderLine(line)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
