import { Post, PostMention, Profile } from "@prisma/client";
import React, { useEffect, useState } from "react";

import PostItem from "./PostItem";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import FeatherIcon from "feather-icons-react";
import { useSetAtom } from "jotai";
import atoms from "../atoms";

import { KEY as POST_KEY } from "./modals/Post";

const Timeline: React.FC = () => {
  const getTimeline = trpc.posts.getTimeline.useMutation();
  const [posts, setPosts] = useState<
    (Post & {
      mentions: (PostMention & {
        profile: Profile;
      })[];
      postedBy: Profile;
    })[]
  >([]);
  const router = useRouter();
  const session = useSession();
  const setModal = useSetAtom(atoms.modal);
  useEffect(() => {
    if (session.status === "authenticated") {
      getTimeline
        .mutateAsync()
        .then((timelinePosts) => setPosts(timelinePosts));
    }
    setPosts([]);
  }, [session.status]);
  return (
    <>
      {posts.length === 0 && getTimeline.isSuccess ? (
        <div className="flex flex-col items-center justify-center w-full h-64 gap-4 px-6">
          <h4 className="text-2xl font-bold text-center text-black dark:text-white md:text-4xl">
            Uh oh! It&apos;s a little quiet here!
          </h4>
          <h5 className="text-xl font-medium text-center text-zinc-700 dark:text-zinc-400 md:text-2xl">
            Let&apos;s get started on sharing some cool details with friends
          </h5>
          <button
            type="button"
            className="relative flex items-center gap-2 px-6 py-2 text-white rounded-full bg-zinc-800 hover:bg-zinc-700 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-100"
            onClick={() => setModal(POST_KEY)}
          >
            <FeatherIcon icon="edit-3" size={16} />
            <span>Add Post</span>
          </button>
        </div>
      ) : (
        <></>
      )}

      {posts.map((post) => (
        <PostItem
          onClick={() =>
            router.push(`/@/${post.postedBy.handle}/post/${post.id}`)
          }
          post={post}
          key={post.id}
        />
      ))}
    </>
  );
};

export default Timeline;
