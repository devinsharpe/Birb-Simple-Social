import { atom } from "jotai";

const modalAtom = atom<string | undefined>(undefined);

const atoms = {
  modal: modalAtom,
};

export default atoms;
