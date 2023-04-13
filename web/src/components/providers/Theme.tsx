import type React from "react";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import atoms from "../../atoms";
import { Theme } from "@prisma/client";

const ThemeProvider: React.FC = () => {
  const settings = useAtomValue(atoms.settings);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (settings) {
        if (
          (settings.theme === Theme.AUTO &&
            window.matchMedia("(prefers-color-scheme: dark)").matches) ||
          settings.theme === Theme.DARK
        ) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }
  }, [settings]);
  return null;
};

export default ThemeProvider;
