import React from "react";
import atoms from "../atoms";
import { useSetAtom } from "jotai";

const LoginPrompt = () => {
  const setModal = useSetAtom(atoms.modal);
  return (
    <div className="container fixed bottom-8 left-1/2 flex max-w-[96vw] -translate-x-1/2 transform flex-wrap items-center justify-between gap-2 rounded-lg bg-violet-600 p-4 px-6 text-white shadow-lg shadow-violet-700/50 md:max-w-[80vw] ">
      <div>
        <h3 className="font-semibold md:text-lg">
          Want to try something different?
        </h3>
        <h4 className="text-xs md:text-sm">
          We&apos;re just interested in connecting people. No ads, tracking, or
          BS.
        </h4>
      </div>
      <div className="flex w-full items-center gap-2 md:w-auto">
        <button
          type="button"
          className="w-full rounded-full bg-white px-4 py-1 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-black md:w-auto md:py-2"
          onClick={() => setModal("login")}
        >
          Log In/Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;
