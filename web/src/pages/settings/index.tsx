import FeatherIcon from "feather-icons-react";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import { NextPage } from "next";
import { Reaction } from "@prisma/client";
import { Switch } from "@headlessui/react";
import { useRouter } from "next/router";
import { useState } from "react";

const SettingsPage: NextPage = () => {
  const [useCatMode, setUseCatMode] = useState(false);
  const [useRelativeTimestamps, setUseRelativeTimestamps] = useState(true);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>Birb - Simple Social</title>
        <meta
          name="description"
          content="Birb, a different type of social network"
        />
      </Head>

      <div className="max-w-2xl min-h-screen py-16 mx-auto space-y-4 overflow-y-scroll divide-y hide-scrollbar divide-zinc-300 dark:divide-zinc-600">
        <section className="w-full px-6 py-4">
          <h2 className="flex items-center gap-4 text-lg font-semibold tracking-wide md:text-2xl">
            <FeatherIcon icon="smile" />
            <span>Reactions</span>
          </h2>
          <div className="pt-4 space-y-2">
            <fieldset className="flex items-center justify-between">
              <label htmlFor="setting-reaction" className="mb-0 md:text-lg">
                Default Reaction
              </label>
              <select
                name="defaultReaction"
                id="setting-reaction"
                className="text-sm rounded dark:bg-zinc-800"
              >
                <option value={Reaction.SMILE}>😊 Smile</option>
                <option value={Reaction.JOY}>😂 Laughing</option>
                <option value={Reaction.HEART_EYES}>😍 Heart Eyes</option>
                <option value={Reaction.DOWNCAST}>🙁 Downcast</option>
                <option value={Reaction.THUMBS_UP}>👍 Thumbs Up</option>
                <option value={Reaction.PINCHED_FINGERS}>
                  🤌 Pinched Fingers
                </option>
                <option value={Reaction.FIRE}>🔥 Fire</option>
              </select>
            </fieldset>
            <fieldset className="flex items-center justify-between pr-2">
              <label htmlFor="setting-cat-mode" className="mb-0 md:text-lg">
                Use Cat Mode
              </label>
              <Switch
                checked={useCatMode}
                id="setting-cat-mode"
                onChange={setUseCatMode}
                className={`${useCatMode ? "bg-violet-900" : "bg-violet-700"}
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    useCatMode ? "translate-x-[24px]" : "translate-x-0"
                  }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </fieldset>
          </div>
        </section>
        <section className="w-full px-6 py-4">
          <h2 className="flex items-center gap-4 text-lg font-semibold tracking-wide md:text-2xl">
            <FeatherIcon icon="eye" />
            <span>Appearance</span>
          </h2>
          <div className="pt-4 space-y-2">
            <fieldset className="flex items-center justify-between">
              <label htmlFor="setting-theme" className="mb-0 md:text-lg">
                Theme
              </label>
              <select
                name="theme"
                id="setting-theme"
                className="text-sm rounded dark:bg-zinc-800"
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="LIGHT">Light</option>
                <option value="DARK">Dark</option>
              </select>
            </fieldset>
            <fieldset className="flex items-center justify-between pr-2">
              <label
                htmlFor="setting-relative-timestamp"
                className="mb-0 md:text-lg"
              >
                Relative Timestamps
              </label>
              <Switch
                checked={useRelativeTimestamps}
                id="setting-relative-timestamp"
                onChange={setUseRelativeTimestamps}
                className={`${
                  useRelativeTimestamps ? "bg-violet-900" : "bg-violet-700"
                }
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    useRelativeTimestamps
                      ? "translate-x-[24px]"
                      : "translate-x-0"
                  }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </fieldset>
          </div>
        </section>
        <section className="w-full px-6 py-4">
          <h2 className="flex items-center gap-4 text-lg font-semibold tracking-wide md:text-2xl">
            <FeatherIcon icon="bell" />
            <span>Notifications</span>
          </h2>
          <div className="flex flex-col items-center pt-4 space-y-4">
            <button
              type="button"
              className="flex items-center justify-center w-full max-w-lg gap-2 py-2 mx-auto border rounded border-zinc-300 bg-zinc-200 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <FeatherIcon icon="power" size={20} />
              <span>Enable PWA Notifications</span>
            </button>
          </div>
        </section>
        <section className="w-full px-6 py-4">
          <h2 className="flex items-center gap-4 text-lg font-semibold tracking-wide md:text-2xl">
            <FeatherIcon icon="user" />
            <span>Profile</span>
          </h2>
          <div className="flex flex-col items-center pt-4 space-y-4">
            <button
              type="button"
              className="flex items-center justify-center w-full max-w-lg gap-2 py-2 mx-auto border rounded border-zinc-300 bg-zinc-200 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <FeatherIcon icon="download" size={20} />
              <span>Download User Data</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-full max-w-lg gap-2 py-2 mx-auto border rounded border-rose-300 bg-rose-200 hover:bg-rose-300 dark:border-rose-700 dark:bg-rose-800 dark:hover:bg-rose-700"
            >
              <FeatherIcon icon="trash" size={20} />
              <span>Delete Account</span>
            </button>
          </div>
        </section>
      </div>

      <Navbar
        brandEl={
          <div className="flex items-center gap-2">
            <button type="button" className="p-1" onClick={() => router.back()}>
              <FeatherIcon icon="arrow-left" size={24} />
            </button>
            <h4 className="text-xl font-bold tracking-wide">Settings</h4>
          </div>
        }
      />
    </>
  );
};

export default SettingsPage;
