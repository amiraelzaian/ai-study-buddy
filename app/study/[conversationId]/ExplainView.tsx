"use client";

// components/explain/ExplainView.tsx

import { saveStudySession } from "../../_lib/actions";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { parseSections, type Message } from "./_explain/explain.utils";
import ExplainTopBar from "./_explain/ExplainTopBar";
import ChatMessage from "./_explain/ChatMessage";
import ChatInput from "./_explain/ChatInput";
import SectionCard from "./_explain/SectionCard";

type Props = {
  topic: string;
  content: string;
  userId: string;
  conversationId: string;
  messages: Message[];
};

export default function ExplainView({
  topic,
  content,
  userId,
  conversationId,
  messages: initialMessages,
}: Props) {
  const [sections, setSections] = useState(() => parseSections(content));
  const [chatMessages, setChatMessages] = useState<Message[]>(
    initialMessages ?? [],
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
        credentials: "include",
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
        setSections(parseSections(data.answer));
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

  const followUpMessages = chatMessages.filter(
    (m) => !(m.role === "user" && m.content === topic) && m.content !== content,
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ExplainTopBar />

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full space-y-4">
        <h1 className="text-3xl font-bold text-foreground">{topic}</h1>

        {sections.map((section, i) => (
          <SectionCard key={i} section={section} index={i} />
        ))}

        {followUpMessages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        sending={sending}
      />
    </div>
  );
}
