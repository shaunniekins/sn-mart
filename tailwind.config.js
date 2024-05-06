/** @type {import('tailwindcss').Config} */

import { nextui } from "@nextui-org/react";

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
        "main-theme": "#7e22ce", // purple-500
        "main-hover-theme": "#a855f7", //purple-700

        "delete-theme": "#ef4444", // red-500
        "delete-hover-theme": "#b91c1c", // red-700

        "edit-theme": "#eab308", // yellow-500
        "edit-hover-theme": "#a16207", // yellow-700

        "disabled-theme": "#6b7280", // gray-500
        "disabled-hover-theme": "#374151", // gray-700

        "hover-gray-theme": "#374151", // gray-700
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
