export const theme = {
  colors: {
    primary: {
      DEFAULT: "#10b981", // Teal color from the screenshot
      foreground: "#ffffff",
    },
    secondary: {
      DEFAULT: "#4f46e5", // Indigo color
      foreground: "#ffffff",
    },
    background: {
      DEFAULT: "#ffffff",
      foreground: "#000000",
    },
    muted: {
      DEFAULT: "#f3f4f6",
      foreground: "#6b7280",
    },
    accent: {
      DEFAULT: "#10b981",
      foreground: "#ffffff",
    },
    destructive: {
      DEFAULT: "#ef4444",
      foreground: "#ffffff",
    },
    border: "#e5e7eb",
    input: "#e5e7eb",
    ring: "#10b981",
  },
  borderRadius: {
    lg: "0.5rem",
    md: "0.375rem",
    sm: "0.25rem",
  },
};

export type Theme = typeof theme;
