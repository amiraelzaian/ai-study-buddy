import ProgressSection from "../dashboard/ProgressSection";

function page() {
  return (
    <div className="flex flex-col md:flex-row">
      <ProgressSection pathname="profile" />
    </div>
  );
}

export default page;
