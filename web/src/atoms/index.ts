// import type { Profile, ProfileReaction, ProfileSettings } from "@prisma/client";
import type {
  Profile,
  ProfileReaction,
  ProfileSetting,
} from "~/server/db/schema/app";

import { atom } from "jotai";
import type FeatherIcon from "feather-icons-react";

export interface Toast {
  id: string;
  icon?: FeatherIcon.Icon;
  content: string;
}

const modalAtom = atom<string | undefined>(undefined);
const profileAtom = atom<Profile | undefined>(undefined);
const reactionsAtom = atom<ProfileReaction[]>([]);
const settingsAtom = atom<ProfileSetting | undefined>(undefined);
const toastsAtom = atom<Toast[]>([]);

modalAtom.debugLabel = "modal";
profileAtom.debugLabel = "profile";
reactionsAtom.debugLabel = "reactions";
settingsAtom.debugLabel = "settings";
toastsAtom.debugLabel = "toasts";

const atoms = {
  modal: modalAtom,
  profile: profileAtom,
  reactions: reactionsAtom,
  settings: settingsAtom,
  toasts: toastsAtom,
};

export default atoms;
