import type { Profile, ProfileSettings } from "@prisma/client";

import { atom } from "jotai";

const modalAtom = atom<string | undefined>(undefined);
const profileAtom = atom<Profile | undefined>(undefined);
const settingsAtom = atom<ProfileSettings | undefined>(undefined);

modalAtom.debugLabel = "modal";
profileAtom.debugLabel = "profile";
settingsAtom.debugLabel = "settings";

const atoms = {
  modal: modalAtom,
  profile: profileAtom,
  settings: settingsAtom,
};

export default atoms;
