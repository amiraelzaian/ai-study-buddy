// components/explain/ChatInput.tsx

import { Send } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  sending: boolean;
};

export default function ChatInput({ value, onChange, onSend, sending }: Props) {
  return (
    <div className="flex-shrink-0 border-t border-border px-6 py-4 bg-background">
      <div className="max-w-2xl mx-auto flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask a follow-up question..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-purple-400
                     transition-all text-sm"
        />
        <button
          onClick={onSend}
          disabled={sending || !value.trim()}
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
  );
}
