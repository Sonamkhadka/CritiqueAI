
import { Button } from "@/components/ui/button";
import { Sun, Moon, Github } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { LogoSvg } from "./Logo"; // Import the LogoSvg component

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 w-full neo-border-thick bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3 pl-1">
          <div className="p-2 bg-primary neo-border neo-shadow-accent">
            <LogoSvg />
          </div>
          <span className="text-xl font-bold text-foreground font-arvo uppercase tracking-wide">Critique AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="neo-button bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <a
              href="https://github.com/Sonamkhadka/Argument-Analyzer.git"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5 mr-2" />
              CODE
            </a>
          </Button>
          <Button
            className="neo-button bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
