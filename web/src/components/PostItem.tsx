import { CAT_REACTION_MAP, REACTION_MAP } from "./modals/Reaction";
// import type { Post, PostMention, PostReaction, Profile } from "@prisma/client";
import type {
  Post,
  PostMention,
  PostReaction,
  Profile,
} from "~/server/db/schema/app";
// import { PostType } from "@prisma/client";
import React, { useMemo } from "react";

import { DEFAULT_AVATAR_URL } from "~/server/db/schema/constants";
import DialogMenu from "./DialogMenu";
import type { DialogMenuItemProps } from "./DialogMenu";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import Link from "next/link";
import { PostDisplay } from "./forms/Post";
import { PostType } from "~/server/db/schema/enums";
import { getAge } from "../utils/demo";
import usePostBlocks from "../hooks/postBlocks";
import useToasts from "../hooks/toasts";

interface PostItemProps {
  catMode?: boolean;
  expandedReactions?: boolean;
  onArchive: (id: string) => void;
  onClick: (
    post: Post & {
      postedBy: Profile;
    }
  ) => void;
  onReactionClick: () => void;
  post: Post & {
    mentions: (PostMention & {
      profile: Profile;
    })[];
    postedBy: Profile;
    reactions: (PostReaction & {
      postedBy: Profile;
    })[];
  };
  sessionUserId: string | undefined;
}

const PostItem: React.FC<PostItemProps> = ({
  catMode = false,
  expandedReactions = false,
  onArchive,
  onClick,
  onReactionClick,
  post,
  sessionUserId,
}) => {
  const age = useMemo(() => getAge(post.createdAt), [post.createdAt]);
  const { blocks } = usePostBlocks(post.text);
  const { addToast } = useToasts();

  const dialogItems = useMemo(() => {
    const items: DialogMenuItemProps[][] = [
      [
        {
          icon: "smile",
          text: "Add Reaction",
          onClick: onReactionClick,
        },
        {
          icon: "message-square",
          text: "View Comments",
          onClick: () => onClick(post),
        },
        {
          icon: "at-sign",
          text: "View Mentions",
          onClick: console.log,
          disabled: !post.mentions.length,
        },
      ],
      [
        {
          icon: "flag",
          text: "Report Post",
          onClick: console.log,
        },
      ],
    ];
    if (post.profileId === sessionUserId && items[0] && items[1]) {
      items[0].shift();
      items[1].unshift({
        icon: "archive",
        text: "Archive Post",
        onClick: () => onArchive(post.id),
      });
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUserId]);

  return (
    <article className="p-6 space-y-4 transition-colors duration-150 hover:bg-zinc-800/5 dark:hover:bg-white/5">
      <div className="flex items-center space-x-2">
        <div className="relative object-center w-10 h-10 overflow-hidden rounded-full shrink-0">
          <Link
            href={`/@/${post.postedBy.handle}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={post.postedBy.avatarUrl ?? DEFAULT_AVATAR_URL}
              alt={`${post.postedBy.name}'s avatar image`}
              className="object-cover object-center w-full h-full"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <div className="w-full">
          <div className="gap-2 md:flex">
            <h4
              className="font-medium whitespace-nowrap hover:underline"
              title={post.postedBy.handle}
            >
              <Link
                href={`/@/${post.postedBy.handle}`}
                onClick={(e) => e.stopPropagation()}
              >
                {post.postedBy.name}
              </Link>
            </h4>
          </div>
          <h5 className="text-sm text-zinc-600 dark:text-zinc-400">
            {`${age.value}${age.unit}`}
            {age.unit === "d" && (
              <>
                &nbsp;&ndash;&nbsp;
                {post.createdAt.toLocaleDateString()}{" "}
              </>
            )}
          </h5>
        </div>
        <DialogMenu
          className="px-2 py-1 text-zinc-600 dark:text-zinc-400"
          items={dialogItems}
        >
          <FeatherIcon icon="more-horizontal" size={24} />
        </DialogMenu>
      </div>

      <div className="pl-12 space-y-4">
        {post.type === PostType.Image && (
          <div className="relative w-full h-48 lg:h-64">
            <Image
              src={post.image}
              alt={post.alt}
              fill
              className="object-contain"
            />
          </div>
        )}

        <p className="max-w-xl whitespace-pre-wrap">
          <PostDisplay blocks={blocks} />
        </p>
        {post.location && (
          <div className="flex items-center gap-2 pt-4 text-sm leading-none text-opacity-50 border-t whitespace-nowrap border-zinc-300 text-zinc-800/75 dark:border-zinc-600 dark:text-white/75">
            <FeatherIcon icon="map-pin" size={16} />
            <p>{post.location}</p>
          </div>
        )}
      </div>
      <div className="flex items-center pl-12 space-x-6">
        {post.profileId !== sessionUserId && (
          <button
            type="button"
            className="p-2 rounded"
            onClick={onReactionClick}
          >
            <FeatherIcon icon="smile" size={16} />
          </button>
        )}
        <Link
          href={`/@/${post.postedBy.handle}/post/${post.id}`}
          className="flex items-center gap-2 p-2 rounded"
        >
          {!!post.commentCount && (
            <span className="text-sm leading-none">{post.commentCount}</span>
          )}
          <FeatherIcon icon="message-square" size={16} />
        </Link>
        <button
          type="button"
          className="p-2 rounded"
          onClick={() => {
            if (navigator.share) {
              navigator
                .share({
                  title: "Check out this post on Birb",
                  url: `/@/${post.postedBy.handle}/post/${post.id}`,
                })
                .catch((err) => console.log(err));
            } else {
              const path =
                window.location.hostname +
                `/@/${post.postedBy.handle}/post/${post.id}`;
              navigator.clipboard.writeText(path);
              addToast({
                id: "post-link-copy",
                content: "Post link copied to clipboard",
                icon: "link",
              });
            }
          }}
        >
          <FeatherIcon icon="share-2" size={16} />
        </button>
        {!expandedReactions && (
          <div className="flex justify-end w-full -space-x-3 items center">
            {post.reactions.map((reaction) => (
              <div
                className="w-8 h-8 overflow-hidden border-2 rounded-full border-zinc-200 dark:border-zinc-900"
                key={reaction.id}
              >
                <Image
                  src={reaction.image}
                  alt="reaction image"
                  className="w-full h-full"
                  width={64}
                  height={64}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {expandedReactions && !!post.reactions.length && (
        <div className="flex items-center justify-start w-full gap-6 p-2 overflow-x-auto">
          {post.reactions.map((reaction) => (
            <Link
              href={`/@/${reaction.postedBy.handle}`}
              className="flex flex-col items-center"
              key={reaction.id}
            >
              <div className="relative w-12 h-12">
                <div className="w-full h-full overflow-hidden border-2 rounded-full border-zinc-200 dark:border-zinc-800">
                  <Image
                    src={reaction.image}
                    alt="reaction image"
                    className="object-cover object-center w-full h-full"
                    width={64}
                    height={64}
                  />
                </div>
                <span className="absolute -bottom-0 -right-3 z-[1] flex h-7 w-7 items-center  justify-center rounded-full bg-zinc-200 text-center text-sm leading-none dark:bg-zinc-700">
                  {catMode
                    ? CAT_REACTION_MAP[reaction.reaction]
                    : REACTION_MAP[reaction.reaction]}
                </span>
              </div>
              <p className="text-xs">{reaction.postedBy.handle}</p>
            </Link>
          ))}
        </div>
      )}
    </article>
  );
};

export default PostItem;
