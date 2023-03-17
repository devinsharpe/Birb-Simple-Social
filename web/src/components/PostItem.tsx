import { Post, PostMention, Profile } from "@prisma/client";
import React, { useMemo } from "react";

import DialogMenu from "./DialogMenu";
import FeatherIcon from "feather-icons-react";
import { HANDLE_REGEX_GLOBAL } from "./forms/Post";
import Image from "next/image";
import Link from "next/link";
import { formatUrl } from "../pages/@/[handle]";

const LINK_REGEX = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/g;

const ONE_HOUR = 3600;
const ONE_DAY = ONE_HOUR * 24;

const getTimestamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

const PostItem: React.FC<{
  onClick: (
    post: Post & {
      postedBy: Profile;
    }
  ) => void;
  post: Post & {
    mentions: (PostMention & {
      profile: Profile;
    })[];
    postedBy: Profile;
  };
}> = ({ onClick, post }) => {
  const age = useMemo(() => {
    const today = getTimestamp(new Date());
    const diff = today - getTimestamp(post.createdAt);
    if (diff < ONE_HOUR) {
      return {
        unit: "m",
        value: Math.floor(diff / 60),
      };
    } else if (diff < ONE_DAY) {
      return {
        unit: "h",
        value: Math.floor(diff / ONE_HOUR),
      };
    } else {
      return {
        unit: "d",
        value: Math.floor(diff / ONE_DAY),
      };
    }
  }, [post.createdAt]);
  const html = useMemo(() => {
    let result = post.text;
    const handles = post.text.match(HANDLE_REGEX_GLOBAL);
    const links = post.text.match(LINK_REGEX);
    if (handles) {
      handles.forEach((handle) => {
        result = result.replaceAll(
          handle.trim(),
          `<a href="/@/${handle
            .trim()
            .replace(
              "@",
              ""
            )}" class="text-violet-700 hover:underline dark:text-violet-400">${handle}</a>`
        );
      });
    }
    if (links) {
      links.forEach((link) => {
        result = result.replaceAll(
          link.trim(),
          `<a href="${formatUrl(
            link
          )}" target="_blank" class="text-violet-700 hover:underline dark:text-violet-400">${link}</a>`
        );
      });
    }
    return result;
  }, [post.text]);
  return (
    <article className="p-6 space-y-4 transition-colors duration-150 hover:bg-zinc-800/5 dark:hover:bg-white/5">
      <div className="flex items-center space-x-2">
        <div className="relative object-center w-10 h-10 overflow-hidden rounded-full shrink-0">
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
          items={[
            [
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
          ]}
        >
          <FeatherIcon icon="more-horizontal" size={24} />
        </DialogMenu>
      </div>

      <div className="pl-12 space-y-4">
        {/* {post.type === PostType.IMAGE && (
          <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-md aspect-square">
            <Image
              src={post.photo}
              alt="demo post photo"
              width={512}
              height={512}
              className="object-cover object-center w-full h-full"
            />
          </div>
        )} */}
        <p className="max-w-xl" dangerouslySetInnerHTML={{ __html: html }}></p>
        {post.location && (
          <div className="flex items-center gap-2 pt-4 text-sm leading-none text-opacity-50 border-t whitespace-nowrap border-zinc-300 text-zinc-800/75 dark:border-zinc-600 dark:text-white/75">
            <FeatherIcon icon="map-pin" size={16} />
            <p>{post.location}</p>
          </div>
        )}
      </div>
      <div className="flex items-center pl-12 space-x-6">
        <button type="button" className="p-2 rounded">
          <FeatherIcon icon="smile" size={16} />
        </button>
        <button type="button" className="p-2 rounded">
          <FeatherIcon icon="message-square" size={16} />
        </button>
        <button
          type="button"
          className="p-2 rounded"
          onClick={() => {
            const path =
              window.location.hostname +
              `/@/${post.postedBy.handle}/post/${post.id}`;
            if (navigator.share) {
              navigator
                .share({
                  title: "Check out this post on Birb",
                  url: path,
                })
                .catch((err) => console.log(err));
            } else {
              navigator.clipboard.writeText(path);
            }
          }}
        >
          <FeatherIcon icon="share-2" size={16} />
        </button>
        <p className="w-full text-sm text-right cursor-pointer text-zinc-600 hover:underline dark:text-zinc-400">
          {post.commentCount} Comment{post.commentCount !== 1 && "s"}
        </p>
      </div>
    </article>
  );
};

export default PostItem;
