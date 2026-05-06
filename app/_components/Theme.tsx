import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
function Theme() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme((theme) => (theme === "dark" ? "light" : "dark"))}
      className="  rounded-full w-[34px] h-[34px] hover:scale-105
     shadow-md flex justify-center items-center bg-gray-100 "
    >
      {theme === "dark" ? (
        <Moon className=" text-blue-500" />
      ) : (
        <Sun className="text-yellow-400" />
      )}
    </button>
  );
}

export default Theme;
