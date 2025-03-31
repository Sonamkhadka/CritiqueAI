
import { Button } from "@/components/ui/button";
import { Sun, Moon, Github } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { LogoSvg } from "./Logo"; // Import the LogoSvg component

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoSvg /> {/* Add the logo SVG here */}
          <span className="text-lg font-semibold">Critique AI</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="mr-2"
          >
            <a
              href="https://github.com/Sonamkhadka/Argument-Analyzer.git"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 px-0 dark:text-white" /* Added dark mode text color */
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
