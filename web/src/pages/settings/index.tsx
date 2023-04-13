import type { ProfileSettings } from "@prisma/client";
import { Reaction, Theme } from "@prisma/client";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

import FeatherIcon from "feather-icons-react";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import type { NextPage } from "next";
import SettingsForm from "../../components/forms/Settings";
import atoms from "../../atoms";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

const SettingsPage: NextPage = () => {
  const router = useRouter();

  const [settings, setSettings] = useState<Omit<ProfileSettings, "id">>({
    reaction: Reaction.SMILE,
    catMode: false,
    theme: Theme.AUTO,
    relativeTimestamps: true,
  });
  const [storedSettings, setStoredSettings] = useAtom(atoms.settings);
  const updateSettings = trpc.profileSettings.update.useMutation();

  const handleReset = useCallback(() => {
    if (storedSettings) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...settingsObj } = storedSettings;
      setSettings(settingsObj);
    }
  }, [storedSettings]);

  const handleSubmit = useCallback(async () => {
    const newSettings = await updateSettings.mutateAsync(settings);
    setStoredSettings(newSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedSettings, settings]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => handleReset, []);

  return (
    <>
      <Head>
        <title>Birb - Simple Social</title>
        <meta
          name="description"
          content="Birb, a different type of social network"
        />
      </Head>

      <div className="hide-scrollbar mx-auto min-h-screen max-w-2xl overflow-y-scroll py-16 ">
        <SettingsForm
          onChange={(newSettings) => setSettings(newSettings)}
          onDeleteAccount={console.log}
          onDownloadUserData={console.log}
          onReset={handleReset}
          onSubmit={handleSubmit}
          settings={settings}
        />
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
