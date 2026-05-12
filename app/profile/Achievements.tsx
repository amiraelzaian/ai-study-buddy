import { Award } from "lucide-react";

function Achievements() {
  return (
    <section
      className=" flex flex-col bg-card rounded-xl p-4 mx-8  
    shadow-md border border-gray-200
     hover:border-primary-400 transition-all duration-75"
    >
      <section className="flex">
        <span className="text-primary-500 text-xl">
          <Award />
        </span>
        <h2 className="">Achievements</h2>
      </section>
      <section className=""></section>
    </section>
  );
}

export default Achievements;
