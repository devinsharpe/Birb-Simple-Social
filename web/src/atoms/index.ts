import type { Profile, ProfileSettings } from "@prisma/client";

import { atom } from "jotai";

const modalAtom = atom<string | undefined>(undefined);
const profileAtom = atom<Profile | undefined>(undefined);
const settingsAtom = atom<ProfileSettings | undefined>(undefined);

const atoms = {
  modal: modalAtom,
  profile: profileAtom,
  settings: settingsAtom,
};

export default atoms;
