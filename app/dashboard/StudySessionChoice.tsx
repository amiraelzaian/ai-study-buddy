import { getCurrentUser, getTheLastConversationId } from "../_lib/actions";
import StudyChoiceCard from "./StudyChoicesCard";

async function StudySessionChoice() {
  const user = await getCurrentUser();
  const lastConversationId = user?.id
    ? await getTheLastConversationId(user.id)
    : null;

  return (
    <section className="w-full px-4 flex flex-col md:flex-row gap-4">
      <StudyChoiceCard
        choice="new"
        topic="Start new topic!"
        conversationId={lastConversationId}
      >
        Explore something new today
      </StudyChoiceCard>

      {lastConversationId && (
        <StudyChoiceCard
          choice="old"
          topic="Continue learning!"
          conversationId={lastConversationId}
        >
          Pick up where you left off
        </StudyChoiceCard>
      )}
    </section>
  );
}
export default StudySessionChoice;
