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
          Birb keeps things simple by archiving all posts older than a week
          automatically. You don't have to worry about what people will think in
          a month, 6 months, or a year from now.
        </p>
        <h4 className="text-xl font-bold uppercase text-violet-700 dark:text-violet-400 md:text-2xl">
          We limited the metrics
        </h4>
        <p>
          What&apos;s the point of collecting all of that information? Social
          media is for keeping friends in the loop and celebrating when
          accomplishments happen.
        </p>
        <h4 className="text-xl font-bold uppercase text-violet-700 dark:text-violet-400 md:text-2xl">
          We hid the cookie jar
        </h4>
        <p>
          Yeah, the kids and our non-existent sales team aren&apos;t happy, but
          we prefer to keep our scope focused on our primary goals.
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
