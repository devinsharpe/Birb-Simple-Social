import { Comment, Profile } from "@prisma/client";
import React, { useMemo } from "react";

import DialogMenu, { DialogMenuItemProps } from "./DialogMenu";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import Link from "next/link";
import { getAge } from "../utils/posts";

interface CommentItemProps {
  comment: Comment & {
    postedBy: Profile;
    children?: (Comment & {
      postedBy: Profile;
    })[];
  };
  onArchive: (id: string) => void;
  onReply: (
    comment: Comment & {
      postedBy: Profile;
    }
  ) => void;
  sessionUserId: string | undefined;
}

const formatDay = (date: Date) => {
  let hours = date.getHours();
  const isPM = hours > 11;
  if (hours > 11) hours -= 12;
  if (hours === 0) hours = 12;
  return `${date.getMonth() + 1}/${date.getDate()} ${hours}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}${isPM ? "p" : "a"}`;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onArchive,
  onReply,
  sessionUserId,
}) => {
  const age = useMemo(() => getAge(comment.createdAt), [comment.createdAt]);
  const dialogItems = useMemo(() => {
    const items: DialogMenuItemProps[][] = [
      [
        {
          icon: "heart",
          text: "Like Comment",
          onClick: console.log,
        },
      ],
      [
        {
          icon: "flag",
          text: "Report Comment",
          onClick: console.log,
        },
      ],
    ];
    if (!comment.commentId && items[0])
      items[0].push({
        icon: "message-circle",
        text: "Reply",
        onClick: () => onReply(comment),
      });
    if (comment.profileId === sessionUserId && items[1])
      items[1].unshift({
        icon: "archive",
        text: "Archive Comment",
        onClick: () => onArchive(comment.id),
      });
    return items;
  }, [comment.id, comment.commentId, sessionUserId]);

  return (
    <>
      <article className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full object-center">
            <Link
              href={`/@/${comment.postedBy.handle}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={
                  comment.postedBy.avatarUrl ??
                  "https://source.unsplash.com/random/600×600/?cat"
                }
                alt={`${comment.postedBy.name}'s avatar image`}
                className="h-full w-full object-cover object-center"
                width={40}
                height={40}
              />
            </Link>
          </div>
          <div className="flex w-full flex-col">
            <h5
              className="whitespace-nowrap font-medium leading-none hover:underline"
              title={comment.postedBy.handle}
            >
              <Link
                href={`/@/${comment.postedBy.handle}`}
                onClick={(e) => e.stopPropagation()}
              >
                {comment.postedBy.name}
              </Link>
            </h5>
            <div className="flex items-center">
              <h6
                className="whitespace-nowrap text-sm font-light opacity-75 hover:underline"
                title={comment.postedBy.handle}
              >
                <Link
                  href={`/@/${comment.postedBy.handle}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  @{comment.postedBy.handle}
                </Link>
              </h6>
              <h6 className="whitespace-nowrap text-sm font-light opacity-75">
                &nbsp;&ndash;&nbsp;
                {age.unit === "d" ? (
                  <>{formatDay(comment.createdAt)}</>
                ) : (
                  <>{`${age.value}${age.unit}`}</>
                )}
              </h6>
            </div>
          </div>
        </div>
        <div className="pt-2 pl-12">
          <p>{comment.text}</p>
        </div>
        <div className="flex w-full items-center gap-4 pt-2 pl-10">
          <button type="button" className="px-2 py-1">
            <FeatherIcon icon="heart" size={16} />
          </button>
          <button
            type="button"
            className="px-2 py-1"
            onClick={() => onReply(comment)}
          >
            <FeatherIcon icon="message-circle" size={16} />
          </button>
          <div className="w-full"></div>
          <div>
            <DialogMenu
              className="px-2 py-1 text-zinc-600 dark:text-zinc-400"
              items={dialogItems}
            >
              <FeatherIcon icon="more-horizontal" size={16} />
            </DialogMenu>
          </div>
        </div>
      </article>
      {comment.children && comment.children.length > 0 && (
        <>
          {comment.children.map((reply) => (
            <div className="pl-8">
              <CommentItem
                key={reply.id}
                comment={reply}
                onArchive={(id) => onArchive(id)}
                onReply={() => {}}
                sessionUserId={sessionUserId}
              />
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default CommentItem;
