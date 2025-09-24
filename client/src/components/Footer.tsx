import React from "react";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-6">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-medium text-foreground font-arvo">
              Critique AI
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Critical analysis of arguments using AI for logical evaluation
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/Sonamkhadka/Argument-Analyzer.git"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-center text-xs text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Critique AI. Open source project for
              critical thinking and rhetorical analysis.
            </p>
            <p className="mt-1">
              This is an educational tool and not a substitute for professional logical analysis.
            </p>
            <p className="mt-1">
              <span className="font-medium">Privacy-focused:</span> All data is stored locally in your browser - we don't store any user information on servers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}