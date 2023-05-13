import type { ProfileSettings } from "@prisma/client";
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
import { useSession } from "next-auth/react";
import Redirect from "../../components/Redirect";

const SettingsPage: NextPage = () => {
  const router = useRouter();

  const session = useSession();
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [storedSettings, setStoredSettings] = useAtom(atoms.settings);
  const updateSettings = trpc.profileSettings.update.useMutation();

  const handleReset = useCallback(() => {
    if (storedSettings) {
      setSettings(storedSettings);
    }
  }, [storedSettings]);

  const handleSubmit = useCallback(async () => {
    if (settings) {
      const newSettings = await updateSettings.mutateAsync(settings);
      setStoredSettings(newSettings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedSettings, settings]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => handleReset(), []);

  if (session.status === "authenticated")
    return (
      <>
        <Head>
          <title>Birb - Simple Social</title>
          <meta
            name="description"
            content="Birb, a different type of social network"
          />
        </Head>

        {settings && (
          <SettingsForm
            isLoading={updateSettings.isLoading}
            onChange={(newSettings) => setSettings(newSettings)}
            onDeleteAccount={console.log}
            onDownloadUserData={console.log}
            onReset={handleReset}
            onSubmit={handleSubmit}
            settings={settings}
          />
        )}

        <Navbar
          brandEl={
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1"
                onClick={() => router.back()}
              >
                <FeatherIcon icon="arrow-left" size={24} />
              </button>
              <h4 className="text-xl font-bold tracking-wide">Settings</h4>
            </div>
          }
        />
      </>
    );
  else return <Redirect href="/" />;
};

export default SettingsPage;
