// import type { ProfileSettings } from "@prisma/client";
import type { ProfileSetting } from "~/server/db/schema/app";
// import { Reaction, Theme } from "@prisma/client";
import { Reaction, Theme } from "~/server/db/schema/enums";

import FeatherIcon from "feather-icons-react";
import React from "react";
import { Switch } from "@headlessui/react";

interface SettingsFormProps {
  settings: ProfileSetting;
  isLoading: boolean;
  onChange: (settings: ProfileSetting) => void;
  onDeleteAccount: () => void;
  onDownloadUserData: () => void;
  onReset: () => void;
  onSubmit: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  isLoading,
  onChange,
  onReset,
  onSubmit,
  settings,
}) => {
  return (
    <form
      className="space-y-4 divide-y divide-zinc-300 dark:divide-zinc-600 "
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <section className="w-full px-6 py-4">
        <h2 className="flex items-center gap-4 text-lg font-semibold tracking-wide md:text-2xl">
          <FeatherIcon icon="smile" />
          <span>Reactions</span>
        </h2>
        <div className="space-y-2 pt-4">
          <fieldset className="flex items-center justify-between">
            <label htmlFor="setting-reaction" className="mb-0 md:text-lg">
              Default Reaction
            </label>
            <select
              name="defaultReaction"
              id="setting-reaction"
              className="rounded text-sm dark:bg-zinc-800"
              onChange={(e) =>
                onChange({ ...settings, reaction: e.target.value as Reaction })
              }
              value={settings.reaction}
            >
              <option value={Reaction.Smile}>😊 Smile</option>
              <option value={Reaction.Joy}>😂 Laughing</option>
              <option value={Reaction.Skull}>💀 Skull</option>
              <option value={Reaction.HeartEyes}>😍 Heart Eyes</option>
              <option value={Reaction.Downcast}>🙁 Sad</option>
              <option value={Reaction.Weeping}>😭 Crying</option>
              <option value={Reaction.ThumbsUp}>👍 Thumbs Up</option>
              <option value={Reaction.PinchedFingers}>
                🤌 Pinched Fingers
              </option>
              <option value={Reaction.Fire}>🔥 Fire</option>
            </select>
          </fieldset>
          <fieldset className="flex items-center justify-between pr-2">
            <label htmlFor="setting-cat-mode" className="mb-0 md:text-lg">
              Use Cat Mode
            </label>
            <Switch
              checked={settings.catMode}
              id="setting-cat-mode"
              onChange={(isChecked) =>
                onChange({ ...settings, catMode: isChecked })
              }
              className={`${
                settings.catMode ? "bg-violet-900" : "bg-violet-700"
              }
    relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${
                  settings.catMode ? "translate-x-[24px]" : "translate-x-0"
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
        <div className="space-y-2 pt-4">
          <fieldset className="flex items-center justify-between">
            <label htmlFor="setting-theme" className="mb-0 md:text-lg">
              Theme
            </label>
            <select
              name="theme"
              id="setting-theme"
              className="rounded text-sm dark:bg-zinc-800"
              value={settings.theme}
              onChange={(e) =>
                onChange({ ...settings, theme: e.target.value as Theme })
              }
            >
              <option value={Theme.Auto}>Automatic</option>
              <option value={Theme.Light}>Light</option>
              <option value={Theme.Dark}>Dark</option>
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
              checked={settings.relativeTimestamps}
              id="setting-relative-timestamp"
              onChange={(isChecked) =>
                onChange({ ...settings, relativeTimestamps: isChecked })
              }
              className={`${
                settings.relativeTimestamps ? "bg-violet-900" : "bg-violet-700"
              }
    relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${
                  settings.relativeTimestamps
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
        <div className="flex flex-col items-center space-y-4 pt-4">
          <button
            type="button"
            className="mx-auto flex w-full max-w-lg items-center justify-center gap-2 rounded border border-zinc-300 bg-zinc-200 py-2 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
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
        <div className="flex flex-col items-center space-y-4 pt-4">
          <button
            type="button"
            className="mx-auto flex w-full max-w-lg items-center justify-center gap-2 rounded border border-zinc-300 bg-zinc-200 py-2 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <FeatherIcon icon="download" size={20} />
            <span>Download User Data</span>
          </button>
          <button
            type="button"
            className="mx-auto flex w-full max-w-lg items-center justify-center gap-2 rounded border border-rose-300 bg-rose-200 py-2 hover:bg-rose-300 dark:border-rose-700 dark:bg-rose-800 dark:hover:bg-rose-700"
          >
            <FeatherIcon icon="trash" size={20} />
            <span>Delete Account</span>
          </button>
        </div>
      </section>
      <section className="flex items-center justify-center gap-4 px-6 py-4">
        <button
          className="flex w-auto items-center justify-center gap-2 rounded-full border border-zinc-300 bg-zinc-200 px-4 py-2 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          onClick={onReset}
          type="button"
        >
          <FeatherIcon icon="refresh-cw" size={20} />
          <span>Reset</span>
        </button>
        <button
          className={`relative flex w-auto items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 hover:bg-zinc-800 dark:border-zinc-100 dark:bg-white dark:hover:bg-zinc-100 ${
            isLoading ? "text-transparent" : "text-white dark:text-zinc-800"
          }`}
          type="submit"
        >
          <FeatherIcon icon="save" size={20} />
          <span>Save Settings</span>

          {isLoading && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ">
              <FeatherIcon
                icon="loader"
                className="text-white dark:text-zinc-800"
                size={16}
              />
            </span>
          )}
        </button>
      </section>
    </form>
  );
};

export default SettingsForm;
