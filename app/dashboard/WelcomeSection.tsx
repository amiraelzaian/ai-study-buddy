import { getCurrentUser } from "../_lib/actions";

async function WelcomeSection() {
  const user = await getCurrentUser();

  return (
    <section className="mx-4 pt-6 pb-4">
      <h1 className="text-secondary-foreground text-xl">
        {" "}
        Welcome back, {user?.user_metadata.name.split(" ")[0]} 👋
      </h1>
      <p className="">Ready to continue your learning journey?</p>
    </section>
  );
}

export default WelcomeSection;
