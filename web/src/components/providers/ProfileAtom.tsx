import atoms from "../../atoms";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSetAtom } from "jotai";

const ProfileAtomProvider = () => {
  const setProfile = useSetAtom(atoms.profile);
  const session = useSession();
  const profile = trpc.profiles.getProfile.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });
  const setModal = useSetAtom(atoms.modal);

  useEffect(() => {
    setProfile(profile.data || undefined);
    if (profile.data?.canChangeHandle) setModal("welcome");
  }, [profile, setModal, setProfile]);

  return null;
};

export default ProfileAtomProvider;
