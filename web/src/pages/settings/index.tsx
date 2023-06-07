import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import type { ProfileSetting } from "~/server/db/schema/app";

import { ArrowLeft } from "lucide-react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import atoms from "../../atoms";
import Navbar from "../../components/Navbar";
import Redirect from "../../components/Redirect";
import SettingsForm from "../../components/forms/Settings";
import { trpc } from "../../utils/trpc";

const SettingsPage: NextPage = () => {
  const router = useRouter();

  const session = useSession();
  const [settings, setSettings] = useState<ProfileSetting | null>(null);
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
      setStoredSettings(newSettings ?? undefined);
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
                <ArrowLeft size={24} />
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
