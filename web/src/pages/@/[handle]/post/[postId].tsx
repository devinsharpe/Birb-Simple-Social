// import type {
//   Comment,
//   Post,
//   PostMention,
//   PostReaction,
//   Profile,
// } from "@prisma/client";
import type {
  Comment,
  Post,
  PostMention,
  PostReaction,
  Profile,
} from "~/server/db/schema/app";
// import { Visibility } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import React, { useCallback, useMemo, useState } from "react";
import ReactionModal, {
  KEY as REACTION_KEY,
} from "../../../../components/modals/Reaction";
import { and, asc, desc, eq, gt } from "drizzle-orm";
import { comments, posts } from "~/server/db/schema/app";
import { useAtomValue, useSetAtom } from "jotai";

import CommentForm from "../../../../components/forms/Comment";
import CommentItem from "../../../../components/CommentItem";
import FeatherIcon from "feather-icons-react";
import Head from "next/head";
import Link from "next/link";
import LoginPrompt from "../../../../components/LoginPrompt";
import Navbar from "../../../../components/Navbar";
import PostItem from "../../../../components/PostItem";
import { Visibility } from "~/server/db/schema/enums";
import atoms from "../../../../atoms";
import { authOptions } from "../../../api/auth/[...nextauth]";
import db from "~/server/db";
import { getServerSession } from "next-auth";
// import { prisma } from "../../../../server/db/client";
import { trpc } from "../../../../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface PageProps {
  hostname: string | undefined;
  post:
    | (Post & {
        mentions: (PostMention & { profile: Profile })[];
        postedBy: Profile;
        reactions: (PostReaction & {
          postedBy: Profile;
        })[];
      })
    | null;
  postComments: (Comment & {
    postedBy?: Profile;
  })[];
}

const PostPage: NextPage<PageProps> = ({ post, postComments }) => {
  const [commentText, setCommentText] = useState("");
  const [replyComment, setReplyComment] = useState<
    | (Comment & {
        postedBy?: Profile;
      })
    | null
  >(null);
  const archiveComment = trpc.comments.archive.useMutation();
  const archivePost = trpc.posts.archive.useMutation();
  const createComment = trpc.comments.create.useMutation();
  const setModal = useSetAtom(atoms.modal);
  const settings = useAtomValue(atoms.settings);
  const router = useRouter();
  const session = useSession();

  const handleArchive = useCallback(async () => {
    if (post) {
      const archivedPost = await archivePost.mutateAsync({ id: post.id });
      if (archivedPost) router.push(`/@/${post.postedBy.handle}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { filteredComments, filteredReplies } = useMemo(() => {
    return {
      filteredComments: postComments.filter((cmmnt) => !cmmnt.commentId),
      filteredReplies: postComments
        .filter((cmmnt) => cmmnt.commentId)
        .reduce<Record<string, (Comment & { postedBy?: Profile })[]>>(
          (prev, curr) => {
            if (!curr.commentId) return prev;
            if (!curr.postedBy) return prev;
            if (prev[curr.commentId])
              return {
                ...prev,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                [curr.commentId]: [...prev[curr.commentId]!, curr],
              };
            else return { ...prev, [curr.commentId]: [curr] };
          },
          {}
        ),
    };
  }, [postComments]);

  const handleSubmit = useCallback(
    async (val: string) => {
      if (post && val) {
        await createComment.mutateAsync({
          postId: post.id,
          text: val,
          commentId: replyComment ? replyComment.id : undefined,
        });
        setCommentText("");
        setReplyComment(null);
      }
      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {post ? (
        <>
          <PostItem
            catMode={settings ? settings.catMode : false}
            expandedReactions
            post={post}
            onArchive={handleArchive}
            onClick={console.log}
            onReactionClick={() => setModal(REACTION_KEY)}
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
          {postComments.length === 0 && (
            <div className="flex h-32 flex-col items-center justify-center opacity-75">
              <h4 className="text-lg font-semibold">
                It&apos;s all quiet here...
              </h4>
              <h5>Just you, {post.postedBy.name}, and Gary 🦆</h5>
            </div>
          )}
          <div className="divide-y divide-zinc-200 overflow-visible dark:divide-zinc-700">
            {filteredComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={filteredReplies[comment.id]}
                onArchive={(id) => archiveComment.mutateAsync({ id })}
                onReply={(comment) => setReplyComment(comment)}
                sessionUserId={session.data?.user?.id}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 pt-12 pb-8">
          <h4 className="text-center text-2xl font-bold text-black dark:text-white md:text-4xl">
            This post doesn&apos;t exist
          </h4>
          <h5 className="text-center text-xl font-medium text-zinc-700 dark:text-zinc-400 md:text-2xl">
            It looks like someone sent you on a wild duck chase 🦆
          </h5>
          <div className="pt-8">
            <Link
              href="/"
              className="relative flex items-center gap-2 rounded-full bg-zinc-800 px-6 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-100"
            >
              <FeatherIcon icon="home" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      )}

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
      {!!post && <ReactionModal postId={post.id} />}
      {session.status === "unauthenticated" && <LoginPrompt />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const session = await getServerSession(context.req, context.res, authOptions);
  if (context.params && context.params.postId && session) {
    const post = await db.query.posts.findFirst({
      where: and(
        eq(posts.id, context.params.postId.toString()),
        eq(posts.visibility, Visibility.Active),
        gt(posts.createdAt, date.toISOString())
      ),
      with: {
        mentions: {
          with: {
            profile: true,
          },
        },
        postedBy: true,
        reactions: {
          with: {
            postedBy: true,
          },
          orderBy: desc(comments.createdAt),
        },
      },
    });
    let postComments: (Comment & { postedBy?: Profile })[];
    if (post) {
      postComments = await db.query.comments.findMany({
        where: and(
          eq(comments.postId, post.id),
          eq(comments.visibility, Visibility.Active)
        ),
        with: {
          postedBy: true,
        },
        orderBy: asc(comments.createdAt),
      });
    } else postComments = [];

    // const post = await db.query.posts.findFirst({
    //   where: and(
    //     eq(posts.id, context.params.postId.toString()),
    //     eq(posts.visibility, Visibility.Active),
    //     gt(posts.createdAt, date.toISOString())
    //   ),
    //   with: {
    //     comments: {
    //       where: eq(comments.visibility, Visibility.Active),
    //       orderBy: desc(comments.createdAt),
    //     },
    //     mentions: {
    //       with: {
    //         profile: true,
    //       },
    //     },
    //     postedBy: true,
    //     reactions: {
    //       with: {
    //         postedBy: true,
    //       },
    //       orderBy: desc(comments.createdAt),
    //     },
    //   },
    // });
    // const post = await prisma.post.findFirst({
    //   where: {
    //     id: context.params.postId.toString(),
    //     createdAt: {
    //       gt: date,
    //     },
    //     visibility: Visibility.Active,
    //   },
    //   include: {
    //     comments: {
    //       where: {
    //         commentId: null,
    //         visibility: Visibility.Active,
    //       },
    //       include: {
    //         children: {
    //           include: {
    //             postedBy: true,
    //           },
    //           orderBy: {
    //             createdAt: "asc",
    //           },
    //         },
    //         postedBy: true,
    //       },
    //       orderBy: {
    //         createdAt: "asc",
    //       },
    //     },
    //     mentions: {
    //       include: {
    //         profile: true,
    //       },
    //     },
    //     postedBy: true,
    //     reactions: {
    //       include: {
    //         profile: true,
    //       },
    //     },
    //   },
    // });
    return {
      props: {
        hostname: context.req.headers.host,
        post: post ?? null,
        postComments,
      },
    };
  }
  return {
    props: {
      hostname: context.req.headers.host,
      post: null,
      postComments: [],
    },
  };
};

export default PostPage;
