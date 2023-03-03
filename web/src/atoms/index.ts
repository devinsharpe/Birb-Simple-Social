import type { Profile } from "@prisma/client";
import { atom } from "jotai";

const modalAtom = atom<string | undefined>(undefined);
const profileAtom = atom<Profile | undefined>(undefined);

const atoms = {
  modal: modalAtom,
  profile: profileAtom,
};

export default atoms;
