import {
  Comment,
  Post,
  PostMention,
  Profile,
  Visibility,
} from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import React, { useCallback, useState } from "react";

import CommentForm from "../../../../components/forms/Comment";
import CommentItem from "../../../../components/CommentItem";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";
import LoginPrompt from "../../../../components/LoginPrompt";
import Navbar from "../../../../components/Navbar";
import PostItem from "../../../../components/PostItem";
import { prisma } from "../../../../server/db/client";
import { trpc } from "../../../../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";

interface PageProps {
  hostname: string | undefined;
  post:
    | (Post & {
        comments: (Comment & {
          children: (Comment & {
            postedBy: Profile;
          })[];
          postedBy: Profile;
        })[];
        mentions: (PostMention & { profile: Profile })[];
        postedBy: Profile;
      })
    | null;
}

const PostPage: NextPage<PageProps> = ({ hostname, post }) => {
  const [commentText, setCommentText] = useState("");
  const [replyComment, setReplyComment] = useState<
    | (Comment & {
        postedBy: Profile;
      })
    | null
  >(null);
  const archiveComment = trpc.comments.archive.useMutation();
  const archivePost = trpc.posts.archive.useMutation();
  const createComment = trpc.comments.create.useMutation();
  const getComment = trpc.comments.get.useMutation();
  const router = useRouter();
  const session = useSession();

  const handleArchive = useCallback(async (id: string) => {
    if (post) {
      const archivedPost = await archivePost.mutateAsync({ id: post.id });
      if (archivedPost) router.push(`/@/${post.postedBy.handle}`);
    }
  }, []);

  const handleSubmit = useCallback(
    async (val: string) => {
      if (post && val) {
        const simpleComment = await createComment.mutateAsync({
          postId: post.id,
          text: val,
          parentId: replyComment ? replyComment.id : undefined,
        });
        if (simpleComment) {
          const comment = await getComment.mutateAsync({
            id: simpleComment.id,
          });
          if (comment && !comment.postId) {
            post.comments.push(comment);
          } else if (comment && comment.postId) {
            const index = post.comments.findIndex(
              (com) => com.id === comment.id
            );
            if (index && post.comments[index])
              post.comments[index]?.children.push();
          }
          setCommentText("");
          setReplyComment(null);
        }
      }
      return null;
    },
    [post, replyComment]
  );

  return (
    <>
      <Head>
        <meta content="article" property="og:type" />
        <meta content={router.asPath} property="og:url" />
        {post && (
          <>
            <meta
              content={`${post?.postedBy.name} on Birb`}
              property="og:title"
            />
            <title>{`${post?.postedBy.name} on Birb`}</title>
            <meta
              content="Birb is a social media trying to do things differently"
              property="og:description"
            />
          </>
        )}
      </Head>
      <section className="max-w-2xl min-h-screen py-16 mx-auto overflow-y-scroll hide-scrollbar">
        {post ? (
          <>
            <PostItem
              post={post}
              onArchive={handleArchive}
              onClick={console.log}
              sessionUserId={session.data?.user?.id}
            />
            <CommentForm
              isLoading={createComment.isLoading}
              onChange={setCommentText}
              onReplyCancel={() => setReplyComment(null)}
              onSubmit={() => handleSubmit(commentText)}
              replyComment={replyComment}
              value={commentText}
            />
            {post.comments.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 opacity-75">
                <h4 className="text-lg font-semibold">
                  It's all quiet here...
                </h4>
                <h5>Just you, {post.postedBy.name}, and Gary 🪿</h5>
              </div>
            )}
            <div className="overflow-visible divide-y divide-zinc-200 dark:divide-zinc-700">
              {post.comments.map((comment) => (
                <CommentItem
                  comment={comment}
                  onArchive={(id) => archiveComment.mutateAsync({ id })}
                  onReply={(comment) => setReplyComment(comment)}
                  sessionUserId={session.data?.user?.id}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 pt-12">
            <h4 className="text-2xl font-bold text-center text-black dark:text-white md:text-4xl">
              This post doesn&apos;t exist
            </h4>
            <h5 className="text-xl font-medium text-center text-zinc-700 dark:text-zinc-400 md:text-2xl">
              It looks like someone sent you on a wild goose chase 🪿
            </h5>
            <div className="pt-8">
              <Link
                href="/"
                className="relative flex items-center gap-2 px-6 py-2 text-white rounded-full bg-zinc-800 hover:bg-zinc-700 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-100"
              >
                <FeatherIcon icon="home" />
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        )}
      </section>
      <Navbar
        brandEl={
          <div className="flex items-center gap-2">
            <button type="button" className="p-1" onClick={() => router.back()}>
              <FeatherIcon icon="arrow-left" size={24} />
            </button>
            <h4 className="text-xl font-bold tracking-wide">Post</h4>
          </div>
        }
      />
      {session.status === "unauthenticated" && <LoginPrompt />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  if (context.params && context.params.postId) {
    const post = await prisma.post.findFirst({
      where: {
        id: context.params.postId.toString(),
        createdAt: {
          gt: date,
        },
        visibility: Visibility.ACTIVE,
      },
      include: {
        comments: {
          where: {
            commentId: null,
            visibility: Visibility.ACTIVE,
          },
          include: {
            children: {
              include: {
                postedBy: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            postedBy: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        mentions: {
          include: {
            profile: true,
          },
        },
        postedBy: true,
      },
    });
    return { props: { hostname: context.req.headers.host, post } };
  }
  return {
    props: {
      hostname: context.req.headers.host,
      post: null,
    },
  };
};

export default PostPage;
