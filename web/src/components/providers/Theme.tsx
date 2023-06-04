import type React from "react";
// import { Theme } from "@prisma/client";
import { Theme } from "~/server/db/schema/enums";
import atoms from "../../atoms";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

const ThemeProvider: React.FC = () => {
  const settings = useAtomValue(atoms.settings);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (settings) {
        if (
          (settings.theme === Theme.Auto &&
            window.matchMedia("(prefers-color-scheme: dark)").matches) ||
          settings.theme === Theme.Dark
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
