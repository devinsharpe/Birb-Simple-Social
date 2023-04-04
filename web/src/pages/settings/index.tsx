import { ProfileSettings, Reaction, Theme } from "@prisma/client";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";

import FeatherIcon from "feather-icons-react";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import { NextPage } from "next";
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

  const handleSubmit = useCallback(async () => {
    const newSettings = await updateSettings.mutateAsync(settings);
    setStoredSettings(newSettings);
  }, [storedSettings, settings]);

  useEffect(() => {
    if (storedSettings) {
      const { id: _, ...settingsObj } = storedSettings;
      setSettings(settingsObj);
    }
  }, [storedSettings]);

  return (
    <>
      <Head>
        <title>Birb - Simple Social</title>
        <meta
          name="description"
          content="Birb, a different type of social network"
        />
      </Head>

      <div className="max-w-2xl min-h-screen py-16 mx-auto overflow-y-scroll hide-scrollbar ">
        <SettingsForm
          onChange={(newSettings) => setSettings(newSettings)}
          onDeleteAccount={console.log}
          onDownloadUserData={console.log}
          onReset={() => {
            console.log(storedSettings);
            if (storedSettings) setSettings({ ...storedSettings });
          }}
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
