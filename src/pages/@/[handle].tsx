import type { GetServerSideProps, NextPage } from "next";
import type {
  Profile,
  ProfileRelationship,
  RelationshipRequest,
} from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import DialogConfirm from "../../components/DialogConfirm";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import LoginPrompt from "../../components/LoginPrompt";
import Navbar from "../../components/Navbar";
import RelationshipModal from "../../components/modals/Relationships";
import atoms from "../../atoms";
import { prisma } from "../../server/db/client";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface PageProps {
  handle: string;
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
        <FeatherIcon icon="user" size={20} />
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
        <FeatherIcon icon="zap" size={20} />
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
        <FeatherIcon icon="clock" size={20} />
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
        <FeatherIcon icon="zap" size={20} />
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
            src="https://source.unsplash.com/random/1920×1080/?cat"
            alt={`Missing profile's header image`}
            className="h-full w-full object-cover object-center grayscale"
            width={1080}
            height={2520}
          />
        </div>

        <div className="absolute inset-x-0 -bottom-12 left-1/2 z-[1] h-28 w-28 -translate-x-1/2 transform overflow-hidden rounded-full border-4 border-white object-center dark:border-zinc-900">
          <Image
            src="https://source.unsplash.com/random/600×600/?cat"
            alt="Missing profile's avatar image"
            className="h-full w-full object-cover object-center grayscale"
            width={256}
            height={256}
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-2 px-4 text-zinc-800 dark:text-zinc-200 md:-mt-12">
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
        <div className="flex items-center justify-center pt-12">
          <button
            type="button"
            className="relative flex items-center gap-2 rounded-full bg-zinc-800 px-6 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-100"
            onClick={() => router.push("/")}
          >
            <FeatherIcon icon="home" />
            <span>Return Home</span>
          </button>
        </div>
      </div>
    </>
  );
};

const formatUrl = (url: string) => {
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
            src={
              profile.headerUrl ||
              "https://source.unsplash.com/random/600×600/?cat"
            }
            alt={`${profile.name}'s header image`}
            className="h-full w-full object-cover object-center"
            width={2520}
            height={1080}
          />
        </div>

        <div className="absolute inset-x-0 -bottom-12 left-1/2 z-[1] h-28 w-28 -translate-x-1/2 transform overflow-hidden rounded-full border-4 border-white object-center dark:border-zinc-900">
          <Image
            src={
              profile.avatarUrl ||
              "https://source.unsplash.com/random/600×600/?cat"
            }
            alt={`${profile.name}'s avatar image`}
            className="h-full w-full object-cover object-center"
            width={256}
            height={256}
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-2 px-4 text-zinc-800 dark:text-zinc-200 md:-mt-12">
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
              <FeatherIcon icon="link" size={16} />
              <h4>
                <a href={formatUrl(profile.website).toString()} target="_blank">
                  {profile.website}
                </a>
              </h4>
            </div>
          )}

          {!!profile.location && (
            <div className="flex items-center gap-2">
              <FeatherIcon icon="map-pin" size={16} />
              <h4>{profile.location}</h4>
            </div>
          )}

          {!!profile.birthdate && (
            <div className="flex items-center gap-2">
              <FeatherIcon icon="gift" size={16} />
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
        <div
          className="group w-full cursor-pointer p-2 text-center"
          onClick={() => onFollowingClick()}
        >
          <h4 className="font-semibold text-black dark:text-white">
            {profile.followingCount}
          </h4>
          <h5 className="text-sm text-zinc-600 group-hover:underline dark:text-zinc-300">
            Following
          </h5>
        </div>
        <div
          className="group w-full cursor-pointer p-2 text-center"
          onClick={() => onFollowerClick()}
        >
          <h4 className="font-semibold text-black dark:text-white">
            {profile.followerCount}
          </h4>
          <h5 className="text-sm text-zinc-600 group-hover:underline dark:text-zinc-300">
            Followers
          </h5>
        </div>
      </div>
    </>
  );
};

const ProfilePage: NextPage<PageProps> = ({ handle, profile }) => {
  const session = useSession();
  const userProfile = useAtomValue(atoms.profile);
  const setModal = useSetAtom(atoms.modal);

  const [forceUnfollow, setForceUnfollow] = useState(false);
  const [relationship, setRelationship] = useState<ProfileRelationship | null>(
    null
  );
  const [request, setRequest] = useState<RelationshipRequest | null>(null);

  const cancelFollow = trpc.requests.cancel.useMutation();
  const followProfile = trpc.requests.follow.useMutation();
  const getRelationship = trpc.relationships.getRelationship.useMutation();
  const removeFollower = trpc.relationships.removeFollower.useMutation();
  const unfollowProfile = trpc.relationships.unfollow.useMutation();

  useEffect(() => {
    if (profile && userProfile) {
      getRelationship.mutateAsync(profile.id).then((response) => {
        setRelationship(response.relationship);
        setRequest(response.request);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, userProfile]);

  const handleCancelClick = useCallback(async () => {
    if (request) {
      await cancelFollow.mutateAsync(request.id);
      setRequest(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const handleFollowClick = useCallback(async () => {
    if (!request && !relationship && profile) {
      const newRequest = await followProfile.mutateAsync(profile.id);
      if (newRequest) setRequest(newRequest);
    }
  }, [request, relationship, profile, followProfile]);

  const handleUnfollow = useCallback(async () => {
    if (relationship && profile) {
      console.log("calling fns");
      await unfollowProfile.mutateAsync({
        id: relationship.id,
        followingId: profile.id,
      });
      setRelationship(null);
      if (forceUnfollow)
        await removeFollower.mutateAsync({ followerId: profile.id });
      setRequest(null);
    }
    setModal(undefined);
  }, [relationship, profile]);

  return (
    <>
      {profile && (
        <>
          <RelationshipModal
            type="FOLLOWER"
            profile={{ id: profile.id, name: profile.name }}
          />
          <RelationshipModal
            type="FOLLOWING"
            profile={{ id: profile.id, name: profile.name }}
          />
          <DialogConfirm
            confirmText="Unfollow"
            denyText="Cancel"
            disabled={unfollowProfile.isLoading || removeFollower.isLoading}
            name="profile-confirm-unfollow"
            text={`In order to see ${profile.name}'s posts, you will have to follow them again.`}
            title={`Unfollow ${profile.name}?`}
            onConfirm={() => handleUnfollow()}
            onDeny={() => setModal(undefined)}
          >
            <fieldset className="rounded-mg flex w-full items-center gap-2 rounded-md py-2">
              <input
                type="checkbox"
                className="h-6 w-6 rounded-md bg-zinc-200 text-violet-400  dark:bg-zinc-600"
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
      <section className="hide-scrollbar container mx-auto h-screen max-w-2xl overflow-y-scroll py-16 ">
        {profile ? (
          <ProfileHeader
            onCancelClick={handleCancelClick}
            onEditClick={() => setModal("profile-edit")}
            onFollowClick={handleFollowClick}
            onFollowerClick={() => setModal("profile-followers")}
            onFollowingClick={() => setModal("profile-following")}
            onUnfollowClick={() => setModal("profile-confirm-unfollow")}
            profile={profile}
            isUser={!!userProfile && profile.id === userProfile.id}
            isFollowing={!!relationship}
            hasRequest={!!request}
            sessionStatus={session.status}
          />
        ) : (
          <BlankHeader handle={handle} />
        )}
      </section>
      <Navbar />
      {session.status === "unauthenticated" && <LoginPrompt />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  let profile: Profile | null = null;
  if (context.params && context.params?.handle) {
    profile = await prisma.profile.findFirst({
      where: {
        handle: context.params.handle as string,
      },
    });
  }
  return {
    props: {
      handle: context.params?.handle as string,
      profile,
    },
  };
};

export default ProfilePage;
