import { Profile, ProfileReaction, ProfileSettings } from "@prisma/client";

import { atom } from "jotai";

const modalAtom = atom<string | undefined>(undefined);
const profileAtom = atom<Profile | undefined>(undefined);
const reactionsAtom = atom<ProfileReaction[]>([]);
const settingsAtom = atom<ProfileSettings | undefined>(undefined);

modalAtom.debugLabel = "modal";
profileAtom.debugLabel = "profile";
reactionsAtom.debugLabel = "reactions";
settingsAtom.debugLabel = "settings";

const atoms = {
  modal: modalAtom,
  profile: profileAtom,
  reactions: reactionsAtom,
  settings: settingsAtom,
};

export default atoms;
