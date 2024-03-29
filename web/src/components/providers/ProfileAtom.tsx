/* eslint-disable @typescript-eslint/no-unused-vars */
import atoms from "../../atoms";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";

const ProfileAtomProvider = () => {
  const [profileAtom, setProfile] = useAtom(atoms.profile);
  const [settingsAtom, setSettings] = useAtom(atoms.settings);
  const session = useSession();
  const profile = trpc.profiles.getProfile.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  useEffect(() => {
    if (profile.data) {
      setProfile(profile.data.profile || undefined);
      setSettings(profile.data.settings || undefined);
    }
  }, [profile.data, setProfile, setSettings]);
  return null;
};

export default ProfileAtomProvider;
