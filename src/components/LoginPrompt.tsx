import React from "react";

const LoginPrompt = () => {
  return (
    <div className="transform container fixed bottom-8 left-1/2 flex -translate-x-1/2 items-center justify-between rounded-lg border bg-violet-600 p-4 px-6 text-white dark:bg-zinc-800">
      <div>
        <h3 className="text-lg font-semibold">
          Want to try something different?
        </h3>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full border border-violet-200 px-4 py-2 font-semibold text-white hover:bg-violet-700"
        >
          Log In
        </button>
        <button
          type="button"
          className="rounded-full bg-white px-4 py-2 font-semibold text-black hover:bg-zinc-100"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;
