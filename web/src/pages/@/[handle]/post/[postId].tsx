import type { GetServerSideProps, NextPage } from "next";
import type { Post, PostMention, Profile } from "@prisma/client";
import Navbar from "../../../../components/Navbar";
import LoginPrompt from "../../../../components/LoginPrompt";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";

import React from "react";
import { prisma } from "../../../../server/db/client";
import PostItem from "../../../../components/PostItem";

interface PageProps {
  post:
    | (Post & {
        mentions: (PostMention & { profile: Profile })[];
        postedBy: Profile;
      })
    | null;
}

const PostPage: NextPage<PageProps> = ({ post }) => {
  const router = useRouter();
  const session = useSession();
  return (
    <>
      <section className="max-w-2xl py-16 mx-auto overflow-y-scroll hide-scrollbar ">
        {post && (
          <>
            <PostItem post={post} onClick={console.log} />
          </>
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
      },
      include: {
        mentions: {
          include: {
            profile: true,
          },
        },
        postedBy: true,
      },
    });
    return { props: { post } };
  }
  return {
    props: {
      post: null,
    },
  };
};

export default PostPage;
