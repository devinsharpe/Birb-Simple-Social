import { Post, PostMention, PostReaction, Profile } from "@prisma/client";
import React, { useMemo } from "react";

import DialogMenu, { DialogMenuItemProps } from "./DialogMenu";
import FeatherIcon from "feather-icons-react";
import { PostDisplay } from "./forms/Post";
import Image from "next/image";
import Link from "next/link";
import { getAge } from "../utils/posts";
import usePostBlocks from "../hooks/postBlocks";
import { REACTION_MAP } from "./modals/Reaction";

interface PostItemProps {
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
      profile: Profile;
    })[];
  };
  sessionUserId: string | undefined;
}

const PostItem: React.FC<PostItemProps> = ({
  expandedReactions = false,
  onArchive,
  onClick,
  onReactionClick,
  post,
  sessionUserId,
}) => {
  const age = useMemo(() => getAge(post.createdAt), [post.createdAt]);
  const { blocks } = usePostBlocks(post.text);

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
    if (post.profileId === sessionUserId && items[1])
      items[1].unshift({
        icon: "archive",
        text: "Archive Post",
        onClick: () => onArchive(post.id),
      });
    return items;
  }, [sessionUserId]);

  return (
    <article className="space-y-4 p-6 transition-colors duration-150 hover:bg-zinc-800/5 dark:hover:bg-white/5">
      <div className="flex items-center space-x-2">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full object-center">
          <Link
            href={`/@/${post.postedBy.handle}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={
                post.postedBy.avatarUrl ??
                "https://source.unsplash.com/random/600×600/?cat"
              }
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

      <div className="space-y-4 pl-12">
        <p className="max-w-xl">
          <PostDisplay blocks={blocks} />
        </p>
        {post.location && (
          <div className="flex items-center gap-2 whitespace-nowrap border-t border-zinc-300 pt-4 text-sm leading-none text-zinc-800/75 text-opacity-50 dark:border-zinc-600 dark:text-white/75">
            <FeatherIcon icon="map-pin" size={16} />
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
            <FeatherIcon icon="smile" size={16} />
          </button>
        )}
        <Link
          href={`/@/${post.postedBy.handle}/post/${post.id}`}
          className="flex items-center gap-2 rounded p-2"
        >
          {!!post.commentCount && (
            <span className="text-sm leading-none">{post.commentCount}</span>
          )}
          <FeatherIcon icon="message-square" size={16} />
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
            }
          }}
        >
          <FeatherIcon icon="share-2" size={16} />
        </button>
        {!expandedReactions && (
          <div className="items center flex w-full justify-end -space-x-3">
            {post.reactions.map((reaction) => (
              <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-zinc-200 dark:border-zinc-900">
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
        <div className="flex w-full items-center justify-start gap-6 overflow-x-auto rounded bg-zinc-100 p-2 dark:bg-zinc-800">
          {post.reactions.map((reaction) => (
            <Link
              href={`/@/${reaction.profile.handle}`}
              className="flex flex-col items-center"
            >
              <div className="relative h-12 w-12">
                <div className="h-full w-full overflow-hidden rounded-full border-2 border-zinc-200 dark:border-zinc-900">
                  <Image
                    src={reaction.image}
                    alt="reaction image"
                    className="h-full w-full object-cover object-center"
                    width={64}
                    height={64}
                  />
                </div>
                <span className="absolute -bottom-0 -right-3 z-[1] flex h-7 w-7 items-center  justify-center rounded-full bg-zinc-200 text-center text-sm leading-none dark:bg-zinc-900">
                  {REACTION_MAP[reaction.reaction]}
                </span>
              </div>
              <p className="text-xs">{reaction.profile.handle}</p>
            </Link>
          ))}
        </div>
      )}
    </article>
  );
};

export default PostItem;
