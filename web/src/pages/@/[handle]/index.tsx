import { and, desc, eq, gt } from "drizzle-orm";
import { useAtomValue, useSetAtom } from "jotai";
import type { GetServerSideProps, NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import type {
  Post,
  PostMention,
  PostReaction,
  Profile,
  ProfileRelationship,
  RelationshipRequest,
} from "~/server/db/schema/app";
import { posts, profiles } from "~/server/db/schema/app";
import {
  DEFAULT_AVATAR_URL,
  DEFAULT_HEADER_URL,
} from "~/server/db/schema/constants";
import ReactionModal, {
  KEY as REACTION_KEY,
} from "../../../components/modals/Reaction";
import RelationshipModal, {
  KEY_OPTIONS,
} from "../../../components/modals/Relationships";

import { Clock, Gift, Home, LinkIcon, MapPin, User, Zap } from "lucide-react";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import authOptions from "~/server/auth/options";
import db from "~/server/db";
import { Visibility } from "~/server/db/schema/enums";
import atoms from "../../../atoms";
import DialogConfirm from "../../../components/DialogConfirm";
import LoginPrompt from "../../../components/LoginPrompt";
import Navbar from "../../../components/Navbar";
import PostItem from "../../../components/PostItem";
import { KEY as PROFILE_KEY } from "../../../components/modals/Profile";
import { trpc } from "../../../utils/trpc";

interface PageProps {
  handle: string;
  posts: (Post & {
    mentions: (PostMention & {
      profile: Profile;
    })[];
    postedBy: Profile;
    reactions: (PostReaction & {
      postedBy: Profile;
    })[];
  })[];
  profile: Profile | null;
}

const ProfileActionButton: React.FC<{
  isUser: boolean;
  isFollowing: boolean;
  hasRequest: boolean;
  onCancel: () => void;
  onEditClick: () => void;
  onFollow: () => void;
  onUnfollow: () => void;
}> = ({
  isUser,
  isFollowing,
  hasRequest,
  onCancel,
  onEditClick,
  onFollow,
  onUnfollow,
}) => {
  if (isUser) {
    return (
      <button
        type="button"
        className="flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 dark:hover:bg-violet-500"
        onClick={onEditClick}
      >
        <User size={20} />
        <span>Edit</span>
      </button>
    );
  } else if (isFollowing) {
    return (
      <button
        type="button"
        className="flex items-center gap-2 rounded-full bg-zinc-600 px-6 py-2 text-white hover:bg-zinc-700 dark:hover:bg-zinc-500"
        onClick={onUnfollow}
      >
        <Zap size={20} />
        <span>Following</span>
      </button>
    );
  } else if (hasRequest) {
    return (
      <button
        type="button"
        className="flex items-center gap-2 rounded-full bg-zinc-600 px-6 py-2 text-white hover:bg-zinc-700 dark:hover:bg-zinc-500"
        onClick={onCancel}
      >
        <Clock size={20} />
        <span>Pending</span>
      </button>
    );
  } else {
    return (
      <button
        type="button"
        className="flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 dark:hover:bg-violet-500"
        onClick={onFollow}
      >
        <Zap size={20} />
        <span>Follow</span>
      </button>
    );
  }
};

const BlankHeader: React.FC<{
  handle: string;
}> = ({ handle }) => {
  const router = useRouter();
  return (
    <>
      <div className="relative mx-auto mb-16 pt-4">
        <div className="relative aspect-[7/3] w-full overflow-hidden sm:rounded-md">
          <Image
            src={DEFAULT_HEADER_URL}
            alt={`Missing profile's header image`}
            className="h-full w-full object-cover object-center grayscale"
            width={1080}
            height={2520}
          />
        </div>

        <div className="absolute inset-x-0 -bottom-12 left-1/2 z-[1] h-28 w-28 -translate-x-1/2 transform overflow-hidden rounded-full border-4 border-white object-center dark:border-zinc-900">
          <Image
            src={DEFAULT_AVATAR_URL}
            alt="Missing profile's avatar image"
            className="h-full w-full object-cover object-center grayscale"
            width={256}
            height={256}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-zinc-800 dark:text-zinc-200 md:-mt-12">
        <div>
          <h2 className="text-2xl font-medium">@{handle}</h2>
        </div>
      </div>

      <div className="pt-12">
        <h4 className="text-center text-2xl font-bold text-black dark:text-white md:text-4xl">
          This account doesn&apos;t exist
        </h4>
        <h5 className="text-center text-xl font-medium text-zinc-700 dark:text-zinc-400 md:text-2xl">
          It seems like not everyone is on Birb yet
        </h5>
        <div className="flex items-center justify-center py-12">
          <button
            type="button"
            className="relative flex items-center gap-2 rounded-full bg-zinc-800 px-6 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-100"
            onClick={() => router.push("/")}
          >
            <Home />
            <span>Return Home</span>
          </button>
        </div>
      </div>
    </>
  );
};

export const formatUrl = (url: string) => {
  const cleanUrl = url
    .replaceAll("www.", "")
    .replaceAll("https://", "")
    .replaceAll("http://", "");
  return new URL(`https://${cleanUrl}`);
};

const ProfileHeader: React.FC<{
  onCancelClick: () => void;
  onEditClick: () => void;
  onFollowClick: () => void;
  onFollowerClick: () => void;
  onFollowingClick: () => void;
  onUnfollowClick: () => void;
  profile: Profile;
  isUser: boolean;
  isFollowing: boolean;
  hasRequest: boolean;
  sessionStatus: "loading" | "authenticated" | "unauthenticated";
}> = ({
  onCancelClick,
  onEditClick,
  onFollowClick,
  onFollowerClick,
  onFollowingClick,
  onUnfollowClick,
  profile,
  isUser,
  isFollowing,
  hasRequest,
  sessionStatus,
}) => {
  return (
    <>
      <div className="relative mx-auto mb-16 pt-4">
        <div className="relative aspect-[7/3] w-full overflow-hidden sm:rounded-md">
          <Image
            src={profile.headerUrl || DEFAULT_HEADER_URL}
            alt={`${profile.name}'s header image`}
            className="h-full w-full object-cover object-center"
            width={2520}
            height={1080}
          />
        </div>

        <div className="absolute inset-x-0 -bottom-12 left-1/2 z-[1] h-28 w-28 -translate-x-1/2 transform overflow-hidden rounded-full border-4 border-white object-center dark:border-zinc-900">
          <Image
            src={profile.avatarUrl || DEFAULT_AVATAR_URL}
            alt={`${profile.name}'s avatar image`}
            className="h-full w-full object-cover object-center"
            width={256}
            height={256}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-zinc-800 dark:text-zinc-200 md:-mt-12">
        <div>
          <h2 className="text-2xl font-medium">{profile.name}</h2>
          <h3 className="font-light text-zinc-600 dark:text-zinc-400">
            @{profile.handle}
          </h3>
        </div>
        {sessionStatus === "authenticated" && (
          <ProfileActionButton
            isUser={isUser}
            isFollowing={isFollowing}
            hasRequest={hasRequest}
            onCancel={onCancelClick}
            onEditClick={onEditClick}
            onFollow={onFollowClick}
            onUnfollow={onUnfollowClick}
          />
        )}
      </div>

      <p className="px-4 py-2 text-zinc-800 dark:text-zinc-200">
        {profile.biography}
      </p>

      {(profile.website || profile.location) && (
        <div className="flex flex-wrap items-center gap-4 px-4 py-2 text-zinc-600 dark:text-zinc-400">
          {!!profile.website && (
            <div className="flex items-center gap-2 underline">
              <LinkIcon size={16} />
              <h4>
                <a
                  href={formatUrl(profile.website).toString()}
                  target="_blank"
                  rel="noreferrer"
                >
                  {profile.website}
                </a>
              </h4>
            </div>
          )}

          {!!profile.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <h4>{profile.location}</h4>
            </div>
          )}

          {!!profile.birthdate && (
            <div className="flex items-center gap-2">
              <Gift size={16} />
              <h4>
                {new Date(
                  profile.birthdate.replaceAll("-", "/")
                ).toLocaleDateString()}
              </h4>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex w-full items-center justify-around divide-x divide-zinc-200 px-2 dark:divide-zinc-700">
        <div className="w-full p-2 text-center">
          <h4 className="font-semibold text-black dark:text-white">
            {profile.postCount}
          </h4>
          <h5 className="text-sm text-zinc-600 dark:text-zinc-300">Posts</h5>
        </div>
        <button
          type="button"
          aria-label="View following"
          className="group w-full cursor-pointer p-2 text-center"
          onClick={() => onFollowingClick()}
          disabled={sessionStatus !== "authenticated"}
        >
          <h4 className="font-semibold text-black dark:text-white">
            {profile.followingCount}
          </h4>
          <h5 className="text-sm text-zinc-600 group-hover:underline dark:text-zinc-300">
            Following
          </h5>
        </button>
        <button
          type="button"
          aria-label="View followers"
          className="group w-full cursor-pointer p-2 text-center"
          onClick={() => onFollowerClick()}
          disabled={sessionStatus !== "authenticated"}
        >
          <h4 className="font-semibold text-black dark:text-white">
            {profile.followerCount}
          </h4>
          <h5 className="text-sm text-zinc-600 group-hover:underline dark:text-zinc-300">
            Followers
          </h5>
        </button>
      </div>
    </>
  );
};

const UNFOLLOW_KEY = "profile-confirm-unfollow";

const ProfilePage: NextPage<PageProps> = ({ handle, posts, profile }) => {
  const router = useRouter();
  const session = useSession();
  const userProfile = useAtomValue(atoms.profile);
  const setModal = useSetAtom(atoms.modal);

  const [forceUnfollow, setForceUnfollow] = useState(false);
  const [relationship, setRelationship] = useState<ProfileRelationship | null>(
    null
  );
  const [request, setRequest] = useState<RelationshipRequest | null>(null);

  const archivePost = trpc.posts.archive.useMutation();
  const cancelFollow = trpc.requests.cancel.useMutation();
  const followProfile = trpc.requests.follow.useMutation();
  const getRelationship = trpc.relationships.get.useMutation();
  const removeFollower = trpc.relationships.removeFollower.useMutation();
  const unfollowProfile = trpc.relationships.unfollow.useMutation();

  useEffect(() => {
    if (profile && userProfile) {
      getRelationship.mutateAsync({ id: profile.id }).then((response) => {
        setRelationship(response.relationship ?? null);
        setRequest(response.request ?? null);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, userProfile]);

  const handleArchive = useCallback(
    async (id: string) => {
      const post = posts.find((p) => p.id === id);
      if (post) {
        const archivedPost = await archivePost.mutateAsync({ id: post.id });
        if (archivedPost) router.reload();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posts, router]
  );

  const handleCancelClick = useCallback(async () => {
    if (request) {
      await cancelFollow.mutateAsync({ id: request.id });
      setRequest(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const handleFollowClick = useCallback(async () => {
    if (!request && !relationship && profile) {
      const newRequest = await followProfile.mutateAsync({ id: profile.id });
      if (newRequest) setRequest(newRequest);
    }
  }, [request, relationship, profile, followProfile]);

  const handleUnfollow = useCallback(async () => {
    if (relationship && profile) {
      console.log("calling fns");
      await unfollowProfile.mutateAsync({
        id: profile.id,
      });
      setRelationship(null);
      if (forceUnfollow) await removeFollower.mutateAsync({ id: profile.id });
      setRequest(null);
    }
    setModal(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationship, profile, forceUnfollow]);

  return (
    <>
      <Head>
        <meta content="profile" property="og:type" />
        <meta content={router.asPath} property="og:url" />
        {profile && (
          <>
            <meta content={`${profile.name} on Birb`} property="og:title" />
            <title>{`${profile.name} on Birb`}</title>
            <meta content={profile.biography ?? ""} property="og:description" />
            <meta
              content={profile.avatarUrl ?? DEFAULT_AVATAR_URL}
              property="og:image"
            />
          </>
        )}
      </Head>
      {profile && (
        <>
          <RelationshipModal
            type={KEY_OPTIONS.follower}
            profile={{ id: profile.id, name: profile.name }}
          />
          <RelationshipModal
            type={KEY_OPTIONS.following}
            profile={{ id: profile.id, name: profile.name }}
          />
          <DialogConfirm
            confirmText="Unfollow"
            denyText="Cancel"
            disabled={unfollowProfile.isLoading || removeFollower.isLoading}
            name={UNFOLLOW_KEY}
            text={`In order to see ${profile.name}'s posts, you will have to follow them again.`}
            title={`Unfollow ${profile.name}?`}
            onConfirm={() => handleUnfollow()}
            onDeny={() => setModal(undefined)}
          >
            <fieldset className="rounded-mg flex w-full items-center gap-2 rounded-md py-2">
              <input
                type="checkbox"
                className="h-6 w-6 rounded-md bg-zinc-200 text-violet-400 dark:bg-zinc-600"
                id="force-profile-unfollow"
                checked={forceUnfollow}
                onChange={(e) => setForceUnfollow(e.target.checked)}
              />
              <label
                htmlFor="force-profile-unfollow"
                className="text-sm font-semibold"
              >
                Remove {profile.name} as a follower
              </label>
            </fieldset>
          </DialogConfirm>
        </>
      )}

      {profile ? (
        <>
          <ProfileHeader
            onCancelClick={handleCancelClick}
            onEditClick={() => setModal(PROFILE_KEY)}
            onFollowClick={handleFollowClick}
            onFollowerClick={() => setModal("profile-followers")}
            onFollowingClick={() => setModal("profile-following")}
            onUnfollowClick={() => setModal(UNFOLLOW_KEY)}
            profile={profile}
            isUser={!!userProfile && profile.id === userProfile.id}
            isFollowing={!!relationship}
            hasRequest={!!request}
            sessionStatus={session.status}
          />
          <section className="container mx-auto max-w-2xl divide-y divide-zinc-300 pt-4 dark:divide-zinc-600">
            {session.status === "authenticated" ? (
              <>
                {posts.length === 0 ? (
                  <div className="flex h-64 w-full flex-col items-center justify-center gap-4 px-6">
                    <h4 className="text-center text-2xl font-bold text-black dark:text-white md:text-4xl">
                      Shhhh! It&apos;s almost like a library here.
                    </h4>
                    <h5 className="text-center text-xl font-medium text-zinc-700 dark:text-zinc-400 md:text-2xl">
                      Peace and quiet is good, let&apos;s use this time to take
                      a break.
                    </h5>
                  </div>
                ) : (
                  <>
                    {posts.map((post) => (
                      <PostItem
                        onArchive={handleArchive}
                        onClick={() =>
                          router.push(
                            `/@/${post.postedBy.handle}/post/${post.id}`
                          )
                        }
                        onReactionClick={() => setModal(REACTION_KEY)}
                        post={post}
                        sessionUserId={session.data?.user?.id}
                        key={post.id}
                      />
                    ))}
                  </>
                )}
              </>
            ) : (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-4 px-6">
                <h4 className="text-center text-2xl font-bold text-black dark:text-white md:text-4xl">
                  Uh oh!!! Looks like you&apos;re not signed in.
                </h4>
                <h5 className="text-center text-xl font-medium text-zinc-700 dark:text-zinc-400 md:text-2xl">
                  Sign in to see {profile.name}&apos;s great posts.
                </h5>
              </div>
            )}
          </section>
        </>
      ) : (
        <BlankHeader handle={handle} />
      )}
      <Navbar />
      <ReactionModal />
      {session.status === "unauthenticated" && <LoginPrompt />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  let profile: Profile | null = null;
  let profilePosts: (Post & {
    mentions: (PostMention & {
      profile: Profile;
    })[];
    postedBy: Profile;
    reactions: (PostReaction & {
      postedBy: Profile;
    })[];
  })[] = [];
  if (context.params && context.params?.handle) {
    profile =
      (await db.query.profiles.findFirst({
        where: eq(profiles.handle, context.params.handle as string),
      })) ?? null;
  }
  const session = await getServerSession(context.req, context.res, authOptions);
  if (profile && session) {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    profilePosts = await db.query.posts.findMany({
      where: and(
        eq(posts.profileId, profile.id),
        gt(posts.createdAt, date.toISOString()),
        eq(posts.visibility, Visibility.Active)
      ),
      with: {
        postedBy: true,
        mentions: {
          with: {
            profile: true,
          },
        },
        reactions: {
          with: {
            postedBy: true,
          },
        },
      },
      orderBy: desc(posts.createdAt),
    });
  }
  return {
    props: {
      handle: context.params?.handle as string,
      profile,
      posts: profilePosts,
    },
  };
};

export default ProfilePage;
