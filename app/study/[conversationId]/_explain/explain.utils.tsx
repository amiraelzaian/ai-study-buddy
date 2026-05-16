// components/explain/explain.utils.ts

export type Message = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

export type Section = {
  heading: string;
  lines: string[];
};

export function parseSections(raw: string): Section[] {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    const isHeading =
      /^#{1,6}\s/.test(line) ||
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
  if (sections.length === 0) return [{ heading: "Overview", lines }];
  return sections;
}

export function renderLine(line: string) {
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

export function isCodeBlock(lines: string[]) {
  return lines.some(
    (l) =>
      l.startsWith("```") ||
      l.startsWith("    ") ||
      /^(function|const|let|var|import|class|def |<)/.test(l),
  );
}

export function isList(lines: string[]) {
  return lines.every((l) => /^[-*•\d.]/.test(l));
}
