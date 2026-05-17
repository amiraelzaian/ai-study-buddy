import { Loader2 } from "lucide-react";

function Spinner() {
  return (
    <div className="flex justify-center items-center gap-2 mx-auto my-auto align-middle">
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
      <span className="text-muted-foreground text-sm">Loading...</span>
    </div>
  );
}

export default Spinner;
