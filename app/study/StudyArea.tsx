"use client";

import { useState } from "react";
import { Lightbulb, HelpCircle, BookOpen, Sparkles, Menu } from "lucide-react";
import ExplainView from "./ExplainView";
import toast from "react-hot-toast";

type Mode = "explain" | "quiz" | "flashcard";

type Props = {
  userId: string;
  onOpenSidebar: () => void;
};

function StudyArea({ userId, onOpenSidebar }: Props) {
  const [topic, setTopic] = useState("");
  const [selectedMode, setSelectedMode] = useState<Mode>("explain");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState("");
  const [activeMode, setActiveMode] = useState<Mode>("explain");
  const [conversationId, setConversationId] = useState<string | null>(null);

  const modes = [
    {
      id: "explain" as Mode,
      label: "Explain",
      sub: "Get a detailed explanation",
      icon: Lightbulb,
    },
    {
      id: "quiz" as Mode,
      label: "Generate Quiz",
      sub: "Test your knowledge",
      icon: HelpCircle,
    },
    {
      id: "flashcard" as Mode,
      label: "Flashcards",
      sub: "Quick review mode",
      icon: BookOpen,
    },
  ];

  async function handleStart() {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }

    setLoading(true);
    setResult(null);
    setActiveTopic(topic.trim());
    setActiveMode(selectedMode);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: topic.trim(),
          subject: topic.trim(),
          mode: selectedMode,
          userId,
          conversationId: null,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("API request failed");
      }
      const data = await res.json();
      console.log(data);

      if (res.status === 429) {
        toast.error(`Daily limit reached (${data.limit} requests/day)`);
        return;
      }

      if (!res.ok || data.error) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      setConversationId(data.conversationId ?? null);

      if (selectedMode === "explain") {
        setResult(data.answer);
      } else {
        setResult(JSON.stringify(data));
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (result && activeMode === "explain") {
    return (
      <ExplainView
        topic={activeTopic}
        content={result}
        userId={userId}
        conversationId={conversationId}
        onBack={() => {
          setResult(null);
          setConversationId(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-6 relative">
      <button
        onClick={onOpenSidebar}
        className="md:hidden self-start mb-6 p-2 rounded-lg hover:bg-muted transition-colors absolute top-3 left-3"
        aria-label="Open sessions"
      >
        <Menu className="w-5 h-5 text-muted-foreground" />
      </button>

      <div className="text-center mb-10 max-w-lg">
        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Learning
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          What would you like to learn?
        </h1>
        <p className="text-muted-foreground">
          Enter any topic and let AI help you master it
        </p>
      </div>

      <div className="w-full max-w-xl bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Topic or subject
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="e.g., React Hooks, Photosynthesis, Spanish Grammar..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-background
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:primary-400
                       transition-all text-sm"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-3">
            Choose how you want to study:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = selectedMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMode(m.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2
                              transition-all duration-200 text-center
                              ${
                                isActive
                                  ? "bg-primary-600 border-primary-600"
                                  : "border-border bg-background hover:border-primary-300 dark:hover:border-primary-700"
                              }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-primary-500"}`}
                  />
                  <span
                    className={`text-sm font-semibold leading-tight ${isActive ? "text-secondary" : "text-secondary-forground"}`}
                  >
                    {m.label}
                  </span>
                  <span
                    className={`text-xs leading-tight ${isActive ? "text-secondary" : "text-secondary-foreground"}`}
                  >
                    {m.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading || !topic.trim()}
          className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-semibold text-sm transition-all
                     flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Start Learning
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Press{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
          Enter
        </kbd>{" "}
        to start
      </p>
    </div>
  );
}

export default StudyArea;
