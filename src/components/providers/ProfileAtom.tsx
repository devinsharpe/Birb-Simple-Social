import React, { useEffect } from "react";

import atoms from "../../atoms";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { useSetAtom } from "jotai";

const ProfileAtomProvider = () => {
  const setProfile = useSetAtom(atoms.profile);
  const session = useSession();
  const profile = trpc.profiles.getProfile.useQuery(undefined);
  setProfile(profile.data || undefined);
  console.log(profile.data);

  return (
    <div>
      <p>Profile Provider</p>
    </div>
  );
};

export default ProfileAtomProvider;
