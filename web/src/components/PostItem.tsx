import React, { useMemo } from "react";
import type {
  Post,
  PostMention,
  PostReaction,
  Profile,
} from "~/server/db/schema/app";
import { CAT_REACTION_MAP, REACTION_MAP } from "./modals/Reaction";

import {
  Archive,
  AtSign,
  Flag,
  LinkIcon,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Pin,
  PinOff,
  Share,
  Smile,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_AVATAR_URL } from "~/server/db/schema/constants";
import { PostType } from "~/server/db/schema/enums";
import usePostBlocks from "../hooks/postBlocks";
import useToasts from "../hooks/toasts";
import { getAge } from "../utils/demo";
import type { DialogMenuItemProps } from "./DialogMenu";
import DialogMenu from "./DialogMenu";
import { PostDisplay } from "./forms/Post";

interface PostItemProps {
  catMode?: boolean;
  expandedReactions?: boolean;
  onArchive: (id: string) => void;
  onClick: (
    post: Post & {
      postedBy: Profile;
    }
  ) => void;
  onPin: (id: string, val: boolean) => void;
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
  onPin,
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
        ...(post.profileId !== sessionUserId
          ? [
              {
                icon: Smile,
                text: "Add Reaction",
                onClick: onReactionClick,
              },
            ]
          : []),

        {
          icon: MessageSquare,
          text: "View Comments",
          onClick: () => onClick(post),
        },
        {
          icon: AtSign,
          text: "View Mentions",
          onClick: console.log,
          disabled: !post.mentions.length,
        },
      ],
      [
        {
          icon: Flag,
          text: "Report Post",
          onClick: console.log,
        },
      ],
      [
        ...(post.profileId === sessionUserId
          ? [
              {
                icon: post.pinned ? PinOff : Pin,
                text: post.pinned ? "Unpin Post" : "Pin Post",
                onClick: () => onPin(post.id, !post.pinned),
              },
              {
                icon: Archive,
                text: "Archive Post",
                onClick: () => onArchive(post.id),
              },
            ]
          : []),
      ],
    ];
    return items;
  }, [onArchive, onClick, onPin, onReactionClick, post, sessionUserId]);

  return (
    <article className="space-y-4 p-6 transition-colors duration-150 hover:bg-zinc-100/25 dark:hover:bg-zinc-800/25">
      <div className="flex items-center space-x-2">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full object-center">
          <Link
            href={`/@/${post.postedBy.handle}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={post.postedBy.avatarUrl ?? DEFAULT_AVATAR_URL}
              alt={`${post.postedBy.name}'s avatar image`}
              className="h-full w-full object-cover object-center"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <div className="w-full">
          <div className="gap-2 md:flex">
            <h4
              className="whitespace-nowrap font-medium hover:underline"
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
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            {post.pinned && (
              <div>
                <Pin size={14} />
                <p className="sr-only">Pinned Post</p>
              </div>
            )}

            <h5 className="text-sm ">
              {`${age.value}${age.unit}`}
              {age.unit === "d" && (
                <>
                  &nbsp;&ndash;&nbsp;
                  {new Date(post.createdAt).toLocaleDateString()}{" "}
                </>
              )}
            </h5>
          </div>
        </div>
        <DialogMenu
          className="px-2 py-1 text-zinc-600 dark:text-zinc-400"
          items={dialogItems}
        >
          <MoreHorizontal size={24} />
        </DialogMenu>
      </div>

      <div className="space-y-4 pl-12">
        {post.type === PostType.Image && (
          <div className="relative h-48 w-full lg:h-64">
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
          <div className="flex items-center gap-2 whitespace-nowrap border-t border-zinc-300 pt-4 text-sm leading-none text-zinc-800/75 text-opacity-50 dark:border-zinc-600 dark:text-white/75">
            <MapPin size={16} />
            <p>{post.location}</p>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-6 pl-12">
        {post.profileId !== sessionUserId && (
          <button
            type="button"
            className="rounded p-2"
            onClick={onReactionClick}
          >
            <Smile size={16} />
          </button>
        )}
        <Link
          href={`/@/${post.postedBy.handle}/post/${post.id}`}
          className="flex items-center gap-2 rounded p-2"
        >
          {!!post.commentCount && (
            <span className="text-sm leading-none">{post.commentCount}</span>
          )}
          <MessageSquare size={16} />
        </Link>
        <button
          type="button"
          className="rounded p-2"
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
                icon: LinkIcon,
                content: "Post link copied to clipboard",
              });
            }
          }}
        >
          <Share size={16} />
        </button>
        {!expandedReactions && (
          <div className="items center flex w-full justify-end -space-x-3">
            {post.reactions.map((reaction) => (
              <div
                className="h-8 w-8 overflow-hidden rounded-full border-2 border-zinc-200 dark:border-zinc-900"
                key={reaction.id}
              >
                <Image
                  src={reaction.image}
                  alt="reaction image"
                  className="h-full w-full"
                  width={64}
                  height={64}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {expandedReactions && !!post.reactions.length && (
        <div className="flex w-full items-center justify-start gap-6 overflow-x-auto p-2">
          {post.reactions.map((reaction) => (
            <Link
              href={`/@/${reaction.postedBy.handle}`}
              className="flex flex-col items-center"
              key={reaction.id}
            >
              <div className="relative h-12 w-12">
                <div className="h-full w-full overflow-hidden rounded-full border-2 border-zinc-200 dark:border-zinc-800">
                  <Image
                    src={reaction.image}
                    alt="reaction image"
                    className="h-full w-full object-cover object-center"
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
