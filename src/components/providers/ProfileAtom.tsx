import React, { useEffect } from "react";

import atoms from "../../atoms";
import { trpc } from "../../utils/trpc";
import { useSetAtom } from "jotai";

const ProfileAtomProvider = () => {
  const setProfile = useSetAtom(atoms.profile);
  const profile = trpc.profiles.getProfile.useQuery(undefined);
  const setModal = useSetAtom(atoms.modal);
  useEffect(() => {
    setProfile(profile.data || undefined);
    if (profile.data?.canChangeHandle) setModal("welcome");
  }, [profile]);

  return null;
};

export default ProfileAtomProvider;
