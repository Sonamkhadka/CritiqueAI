import { Github, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="py-4 border-b dark:border-gray-800 dark:text-white"> {/* Added dark mode text color */}
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold dark:text-white"> {/* Added dark mode text color */} Argument Analyzer</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 px-0 dark:text-white" {/* Added dark mode text color */}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1 dark:text-white" {/* Added dark mode text color */}
            asChild
          >
            <a href="https://github.com/Sonamkhadka/Argument-Analyzer.git" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Clone</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}