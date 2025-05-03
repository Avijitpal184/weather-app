import { useTheme } from "@/context/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import CitySearch from "./CitySearch";

const Header = () => {
  const { setTheme, theme } = useTheme();
  const isDark: boolean = theme === "dark";

  // theme toggle
  const themeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto sm:h-16 h-14 items-center flex justify-between px-4 gap-4">
        <Link to={"/"} className="w-1/3 sm:w-auto">
          <img
            src={`/logo.png`}
            alt="klimate logo"
            className="sm:h-14 h-12"
          />
        </Link>

        <div className="flex items-center gap-1 sm:gap-4 w-full sm:w-auto justify-end">
          {/* search */}
          <CitySearch />

          {/* theme toggle */}
          <div
            className="hover:bg-accent px-2 py-2 rounded-md cursor-pointer"
            onClick={themeToggle}
          >
            <div
              className={`flex items-center cursor-pointer transition-transform duration-500 ${
                isDark ? "rotate-180" : "rotate-0"
              }`}
            >
              {isDark ? (
                <Sun className="h-4 w-4  rotate-0 transition-all sm:h-5 sm:w-5 " />
              ) : (
                <Moon className="h-5 w-5 rotate-0 transition-all " />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
