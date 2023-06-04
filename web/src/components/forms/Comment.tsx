// import type { Comment, Profile } from "@prisma/client";
import type { Comment, Profile } from "~/server/db/schema/app";
import React from "react";

import FeatherIcon from "feather-icons-react";
import Link from "next/link";
import { PostEditor } from "./Post";

interface CommentFormProps {
  isLoading: boolean;
  onChange: (val: string) => void;
  onReplyCancel: () => void;
  onSubmit: () => void;
  replyComment:
    | (Comment & {
        postedBy: Profile;
      })
    | null;
  value: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  isLoading,
  onChange,
  onReplyCancel,
  onSubmit,
  replyComment,
  value,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="border-y border-zinc-300 p-4 dark:border-zinc-600"
    >
      {replyComment && (
        <div className="flex items-center gap-4 ">
          {/* <div className="relative object-center w-10 h-10 overflow-hidden rounded-full shrink-0">
            <Link
              href={`/@/${replyComment.postedBy.handle}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={
                  replyComment.postedBy.avatarUrl ??
                  "https://source.unsplash.com/random/600×600/?cat"
                }
                alt={`${replyComment.postedBy.name}'s avatar image`}
                className="object-cover object-center w-full h-full"
                width={40}
                height={40}
              />
            </Link>
          </div> */}
          <div className="w-full">
            <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">
              Replying to&nbsp;
              <Link
                href={`/@/${replyComment.postedBy.handle}`}
                onClick={(e) => e.stopPropagation()}
                className="text-violet-700 hover:underline dark:text-violet-400"
              >
                <span className="font-normal">
                  {replyComment.postedBy.name}&nbsp;
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  @{replyComment.postedBy.handle}
                </span>
              </Link>
            </p>
            <p className="text-zinc-500 dark:text-zinc-400">
              {replyComment.text}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="w-full">
          <PostEditor
            placeholder="Want to add a comment?"
            onChange={onChange}
            value={value}
          />
        </div>
        {replyComment && (
          <button
            type="button"
            className={`relative flex items-center justify-center gap-2 rounded-full bg-zinc-600 p-2 text-white transition-colors duration-100 hover:bg-zinc-700 focus:bg-zinc-700 ${
              isLoading ? "text-transparent" : ""
            }`}
            onClick={onReplyCancel}
          >
            <FeatherIcon icon="x" size={20} />
          </button>
        )}

        <button
          type="submit"
          className={`relative flex items-center justify-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-white transition-colors duration-100 hover:bg-violet-700 focus:bg-violet-700 ${
            isLoading ? "text-transparent" : ""
          }`}
        >
          <FeatherIcon icon="message-square" size={20} />
          <span className="hidden md:inline-block">Post</span>
          {isLoading && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ">
              <FeatherIcon icon="loader" className="text-white" size={16} />
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
