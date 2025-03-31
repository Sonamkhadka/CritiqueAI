
import React from "react";
import { useTheme } from "./ThemeProvider";

export function LogoSvg() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="8" fill={isDark ? "#1a1a1a" : "white"} />
      <path
        d="M20 6C12.268 6 6 12.268 6 20C6 27.732 12.268 34 20 34C27.732 34 34 27.732 34 20C34 12.268 27.732 6 20 6ZM20 8C26.617 8 32 13.383 32 20C32 26.617 26.617 32 20 32C13.383 32 8 26.617 8 20C8.00706 13.386 13.386 8.00706 20 8Z"
        fill={isDark ? "hsl(180 55% 60%)" : "hsl(180 55% 40%)"}
      />
      <path
        d="M12 20L19 27L28 16"
        stroke={isDark ? "hsl(180 55% 60%)" : "hsl(180 55% 40%)"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 14H26"
        stroke={isDark ? "hsl(180 55% 60%)" : "hsl(180 55% 40%)"}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M14 26H26"
        stroke={isDark ? "hsl(180 55% 60%)" : "hsl(180 55% 40%)"}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
