import type { Post, PostMention, PostReaction, Profile } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";

import PostItem from "./PostItem";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import FeatherIcon from "feather-icons-react";
import { useSetAtom } from "jotai";
import atoms from "../atoms";

import { KEY as POST_KEY } from "./modals/Post";
import ReactionModal, { KEY as REACTION_KEY } from "./modals/Reaction";

const Timeline: React.FC = () => {
  const getTimeline = trpc.posts.getTimeline.useMutation();
  const [posts, setPosts] = useState<
    (Post & {
      mentions: (PostMention & {
        profile: Profile;
      })[];
      postedBy: Profile;
      reactions: (PostReaction & {
        profile: Profile;
      })[];
    })[]
  >([]);
  const [currentPost, setCurrentPost] = useState<string>("");
  const router = useRouter();
  const session = useSession();
  const setModal = useSetAtom(atoms.modal);

  const archivePost = trpc.posts.archive.useMutation();

  const handleArchive = useCallback(
    async (id: string) => {
      const post = posts.find((p) => p.id === id);
      if (post) {
        const updatedPost = await archivePost.mutateAsync({ id });
        if (updatedPost) router.reload();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posts]
  );

  useEffect(() => {
    if (session.status === "authenticated") {
      getTimeline
        .mutateAsync()
        .then((timelinePosts) => setPosts(timelinePosts));
    }
    setPosts([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);
  return (
    <>
      {posts.length === 0 && getTimeline.isSuccess ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-4 px-6">
          <h4 className="text-center text-2xl font-bold text-black dark:text-white md:text-4xl">
            Uh oh! It&apos;s a little quiet here!
          </h4>
          <h5 className="text-center text-xl font-medium text-zinc-700 dark:text-zinc-400 md:text-2xl">
            Let&apos;s get started on sharing some cool details with friends
          </h5>
          <button
            type="button"
            className="relative flex items-center gap-2 rounded-full bg-zinc-800 px-6 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-100"
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
          onArchive={handleArchive}
          onClick={() =>
            router.push(`/@/${post.postedBy.handle}/post/${post.id}`)
          }
          onReactionClick={() => {
            setCurrentPost(post.id);
            setModal(REACTION_KEY);
          }}
          post={post}
          sessionUserId={session.data?.user?.id}
          key={post.id}
        />
      ))}

      <ReactionModal postId={currentPost} />
    </>
  );
};

export default Timeline;
