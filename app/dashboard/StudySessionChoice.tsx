import StudyChoiceCard from "./StudyChoicesCard";

function StudySessionChoice() {
  return (
    <section className="w-full px-4 flex flex-col md:flex-row gap-4 ">
      <StudyChoiceCard choice="new" topic="Start new topic!">
        Explore something new today
      </StudyChoiceCard>
      <StudyChoiceCard choice="old" topic="Continue learning!">
        Pick up where you left off
      </StudyChoiceCard>
    </section>
  );
}

export default StudySessionChoice;
