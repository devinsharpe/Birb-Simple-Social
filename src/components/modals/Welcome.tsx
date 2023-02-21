import { useAtomValue, useSetAtom } from "jotai";

import DialogModal from "../DialogModal";
import React from "react";
import atoms from "../../atoms";

const WelcomeModal = () => {
  const profile = useAtomValue(atoms.profile);
  const setModal = useSetAtom(atoms.modal);
  return (
    <DialogModal name="welcome" title="Welcome to Birb">
      <section className="space-y-2">
        <h3 className="text-xl font-bold text-zinc-600 dark:text-zinc-400 md:text-2xl">
          What's different
          <span className="text-violet-600 dark:text-violet-400"> @ </span>
          Birb?
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          Birb is attempting to connect friends without the pressures that come
          with modern social media.
        </p>
        <h4 className="text-xl font-bold uppercase text-violet-700 dark:text-violet-400 md:text-2xl">
          Don&apos;t worry about the <em>perfect</em> image
        </h4>
        <p>
          Birb simplifies things by automatically archiving all posts that are
          more than a week old. This means that you can rest easy, without
          having to concern yourself with how your posts will be perceived in
          the future, be it a month, six months, or even a year from now.
        </p>
        <h4 className="text-xl font-bold uppercase text-violet-700 dark:text-violet-400 md:text-2xl">
          We limited the metrics
        </h4>
        <p>
          Why bother amassing all that data? After all, the purpose of social
          media is to keep your friends updated and to celebrate your
          achievements.
        </p>
        <h4 className="text-xl font-bold uppercase text-violet-700 dark:text-violet-400 md:text-2xl">
          We hid the cookie jar
        </h4>
        <p>
          Although our non-existent sales team and the kids may not be pleased,
          we prioritize keeping our focus on our primary objectives.
        </p>

        <div className="flex items-center justify-center">
          <button
            type="button"
            className="relative mt-4 rounded-full bg-zinc-800 px-10 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-100"
            onClick={() =>
              setModal(
                profile && profile.canChangeHandle ? "profile-edit" : undefined
              )
            }
          >
            Dismiss
          </button>
        </div>
      </section>
    </DialogModal>
  );
};

export default WelcomeModal;
