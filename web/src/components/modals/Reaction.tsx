import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Camera, Check, Loader, X } from "lucide-react";
import Image from "next/image";
import type { ChangeEvent } from "react";
import React, { useMemo, useRef, useState } from "react";
import type { ProfileReaction } from "~/server/db/schema/app";
import { Reaction, Visibility } from "~/server/db/schema/enums";
import atoms from "../../atoms";
import useUpload from "../../hooks/upload";
import { trpc } from "../../utils/trpc";
import DialogModal from "../DialogModal";

export const KEY = "post-reaction";

export const REACTION_MAP: {
  [key in Reaction]: string;
} = {
  [Reaction.Smile]: "😊",
  [Reaction.Joy]: "😂",
  [Reaction.Skull]: "💀",
  [Reaction.HeartEyes]: "😍",
  [Reaction.Downcast]: "🙁",
  [Reaction.Weeping]: "😭",
  [Reaction.ThumbsUp]: "👍",
  [Reaction.PinchedFingers]: "🤌",
  [Reaction.Fire]: "🔥",
  [Reaction.Heart]: "❤️",
};

export const CAT_REACTION_MAP: {
  [key in Reaction]: string;
} = {
  [Reaction.Smile]: "😸",
  [Reaction.Joy]: "😹",
  [Reaction.Skull]: "💀",
  [Reaction.HeartEyes]: "😻",
  [Reaction.Downcast]: "😾",
  [Reaction.Weeping]: "😿",
  [Reaction.ThumbsUp]: "👍",
  [Reaction.PinchedFingers]: "🤌",
  [Reaction.Fire]: "🔥",
  [Reaction.Heart]: "❤️",
};

interface ReactionButtonProps {
  catMode: boolean;
  image?: string;
  isLoading: boolean;
  onUploadClick: (reaction: Reaction) => void;
  onReactionClick: (reaction: Reaction) => void;
  onReset: (reaction: Reaction) => void;
  reaction: Reaction;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  catMode,
  image,
  isLoading,
  onReactionClick,
  onReset,
  onUploadClick,
  reaction,
}) => {
  return (
    <div
      className={`relative flex h-20 w-20 items-center justify-center rounded-full border-2 ${
        image ? "" : "border-dashed"
      } border-zinc-300 text-lg hover:bg-zinc-200 dark:border-zinc-600 dark:hover:bg-zinc-700`}
    >
      {image ? (
        <button
          type="button"
          className="absolute -bottom-0 -left-3 z-[1] flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-900 dark:text-white"
          onClick={() => onReset(reaction)}
        >
          <X size={20} />
        </button>
      ) : (
        <button
          type="button"
          className="absolute top-1/2 left-1/2 z-[1] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-900/50 dark:text-white"
          onClick={() => onUploadClick(reaction)}
        >
          {isLoading ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <Camera size={20} />
          )}
        </button>
      )}
      {image && (
        <button
          type="button"
          className="group relative h-full w-full rounded-full"
          onClick={() => onReactionClick(reaction)}
        >
          <span className="absolute inset-0 hidden h-full w-full items-center justify-center rounded-full bg-zinc-900/50 text-white group-hover:flex">
            <Check size={30} />
          </span>
          <Image
            src={image}
            height={128}
            width={128}
            alt={`${reaction.toLowerCase()} reaction image`}
            className="h-full w-full rounded-full object-cover object-center"
          />
        </button>
      )}

      <span className="absolute -bottom-0 -right-3 z-[1] flex h-7 w-7 items-center  justify-center rounded-full bg-zinc-200 text-center text-sm leading-none dark:bg-zinc-900 md:h-9 md:w-9 md:text-base">
        {catMode ? CAT_REACTION_MAP[reaction] : REACTION_MAP[reaction]}
      </span>
    </div>
  );
};

interface ReactionModalProps {
  postId?: string;
}

const ReactionModal: React.FC<ReactionModalProps> = ({ postId }) => {
  const [currentReaction, setCurrentReaction] = useState<Reaction | undefined>(
    undefined
  );
  const createReaction = trpc.profileReactions.create.useMutation();
  const updateReaction = trpc.profileReactions.update.useMutation();
  const createPostReaction = trpc.postReactions.create.useMutation();
  const { handleUpload } = useUpload();
  const [reactions, setReactions] = useAtom(atoms.reactions);
  const setModal = useSetAtom(atoms.modal);
  const settings = useAtomValue(atoms.settings);
  const reactionsMap = useMemo(() => {
    return reactions.reduce<{
      [key in Reaction]?: ProfileReaction;
    }>((prev, curr) => ({ ...prev, [curr.reaction]: curr }), {});
  }, [reactions]);
  const uploadRef = useRef<HTMLInputElement | null>(null);

  const handleReset = async (reaction: Reaction) => {
    const reactionObj = reactions.find((rct) => rct.reaction === reaction);
    if (reactionObj) {
      await updateReaction.mutateAsync({
        id: reactionObj.id,
        status: Visibility.Archived,
      });
      setReactions(reactions.filter((rct) => rct.id !== reactionObj.id));
    }
  };

  const handleUploadClick = (reaction: Reaction) => {
    setCurrentReaction(reaction);
    if (uploadRef.current) uploadRef.current.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await handleUpload(e.target.files[0]);
      if (currentReaction) {
        const reaction = await createReaction.mutateAsync({
          reaction: currentReaction,
          image: url,
        });
        const oldReaction = reactions.find(
          (rct) => rct.reaction === currentReaction
        );
        if (oldReaction)
          await updateReaction.mutateAsync({
            id: oldReaction.id,
            status: Visibility.Archived,
          });
        if (reaction)
          setReactions([
            ...reactions.filter((rct) => rct.reaction !== currentReaction),
            reaction,
          ]);
      }
    }
    setCurrentReaction(undefined);
  };

  const handleReactionClick = React.useCallback(
    async (reaction: Reaction) => {
      const profileReaction = reactions.find(
        (rct) => rct.reaction === reaction
      );
      if (postId && profileReaction) {
        await createPostReaction.mutateAsync({
          postId,
          reactionId: profileReaction.id,
        });
      }
      setModal(undefined);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postId, reactions]
  );

  return (
    <>
      <DialogModal isDismissable={true} name={KEY} title="Add Reaction">
        <>
          <div className="grid grid-cols-2 place-items-center gap-4 md:grid-cols-4">
            {Object.keys(REACTION_MAP).map((rct, index) => (
              <ReactionButton
                key={`${rct}-${index}`}
                catMode={settings ? settings.catMode : false}
                isLoading={currentReaction === rct}
                onReactionClick={handleReactionClick}
                onReset={handleReset}
                onUploadClick={handleUploadClick}
                reaction={rct as Reaction}
                image={reactionsMap[rct as Reaction]?.image}
              />
            ))}
          </div>
          <div className="hidden">
            <input
              accept="image/png, image/jpeg, image/jpg"
              id="reaction-upload"
              name="reactionImage"
              onChange={handleFileChange}
              ref={uploadRef}
              type="file"
            />
          </div>
        </>
      </DialogModal>
    </>
  );
};

export default ReactionModal;
