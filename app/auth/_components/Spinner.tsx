import { SplinePointer } from "lucide-react";

function Spinner() {
  return (
    <div className="spinner mx-auto  my-auto flex justify-center items-center ">
      <SplinePointer /> loading...
    </div>
  );
}

export default Spinner;
