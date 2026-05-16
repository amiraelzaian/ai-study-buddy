import { notFound, redirect } from "next/navigation";
import {
  getCurrentUser,
  getConversationWithMessages,
} from "../../_lib/actions";
import ExplainView from "./ExplainView";
import QuizView from "./QuizView";
import FlashcardView from "./FlashcardView";

type Props = {
  params: Promise<{ conversationId: string }>;
};
export const revalidate = 60;
export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const conversation = await getConversationWithMessages(conversationId);
  if (!conversation) notFound();

  // Get the first AI message (model role) as the main content
  const messages = conversation.messages ?? [];
  const firstAiMessage = messages.find((m) => m.role === "model");

  if (!firstAiMessage) notFound();

  const mode = conversation.mode;

  if (mode === "explain") {
    return (
      <ExplainView
        topic={conversation.subject}
        content={firstAiMessage.content}
        userId={user.id}
        conversationId={conversationId}
        messages={messages}
      />
    );
  }

  if (mode === "quiz") {
    // parse quiz JSON from first AI message
    let questions = [];
    try {
      const clean = firstAiMessage.content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      questions = parsed.questions ?? [];
    } catch {
      notFound();
    }

    return (
      <QuizView
        topic={conversation.subject}
        questions={questions}
        userId={user.id}
        conversationId={conversationId}
      />
    );
  }

  if (mode === "flashcard") {
    let flashcards = [];
    try {
      const clean = firstAiMessage.content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      flashcards = parsed.flashcards ?? [];
    } catch {
      notFound();
    }

    return (
      <FlashcardView
        topic={conversation.subject}
        flashcards={flashcards}
        userId={user.id}
        conversationId={conversationId}
      />
    );
  }

  notFound();
}
