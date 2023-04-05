import React, { useEffect } from "react";
import { useAtomValue } from "jotai";
import atoms from "../../atoms";
import { Theme } from "@prisma/client";

const ThemeProvider = () => {
  const settings = useAtomValue(atoms.settings);
  useEffect(() => {
    console.log(settings);
    if (typeof window !== "undefined") {
      console.log(window.matchMedia("(prefers-color-scheme: dark)"));
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
