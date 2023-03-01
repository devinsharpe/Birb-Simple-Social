import type { GetServerSideProps, NextPage } from "next";
import type {
  Profile,
  ProfileRelationship,
  RelationshipRequest,
} from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import { RelationshipType, RequestStatus } from "@prisma/client";
import { useAtomValue, useSetAtom } from "jotai";

import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import LoginPrompt from "../../components/LoginPrompt";
import Navbar from "../../components/Navbar";
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
}> = ({ isUser, isFollowing, hasRequest, onCancel, onEditClick, onFollow }) => {
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

        <div className="absolute inset-x-0 -bottom-12 left-1/2 z-[1] h-28 w-28 -translate-x-1/2 transform overflow-hidden rounded-full border-4 border-white object-center dark:border-zinc-800">
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

const ProfileHeader: React.FC<{
  onCancelClick: () => void;
  onEditClick: () => void;
  onFollowClick: () => void;
  profile: Profile;
  isUser: boolean;
  isFollowing: boolean;
  hasRequest: boolean;
}> = ({
  onCancelClick,
  onEditClick,
  onFollowClick,
  profile,
  isUser,
  isFollowing,
  hasRequest,
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

        <div className="absolute inset-x-0 -bottom-12 left-1/2 z-[1] h-28 w-28 -translate-x-1/2 transform overflow-hidden rounded-full border-4 border-white object-center dark:border-zinc-800">
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
        <ProfileActionButton
          isUser={isUser}
          isFollowing={isFollowing}
          hasRequest={hasRequest}
          onCancel={onCancelClick}
          onEditClick={onEditClick}
          onFollow={onFollowClick}
        />
      </div>
      <p className="px-4 py-2 text-zinc-800 dark:text-zinc-200">
        {profile.biography}
      </p>
      <div className="mt-4 flex w-full items-center justify-around divide-x divide-zinc-200 px-2 dark:divide-zinc-700">
        <div className="w-full p-2 text-center">
          <h4 className="font-semibold text-black dark:text-white">
            {profile.postCount}
          </h4>
          <h5 className="text-sm text-zinc-600 dark:text-zinc-300">Posts</h5>
        </div>
        <div className="w-full p-2 text-center">
          <h4 className="font-semibold text-black dark:text-white">
            {profile.followingCount}
          </h4>
          <h5 className="text-sm text-zinc-600 dark:text-zinc-300">
            Following
          </h5>
        </div>
        <div className="w-full p-2 text-center">
          <h4 className="font-semibold text-black dark:text-white">
            {profile.followerCount}
          </h4>
          <h5 className="text-sm text-zinc-600 dark:text-zinc-300">
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

  const [relationship, setRelationship] = useState<ProfileRelationship | null>(
    null
  );
  const [request, setRequest] = useState<RelationshipRequest | null>(null);

  const cancelFollow = trpc.profiles.cancelFollow.useMutation();
  const followProfile = trpc.profiles.requestFollow.useMutation();
  const getRelationship = trpc.profiles.getRelationship.useMutation();

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
      console.log(newRequest);
      if (newRequest) setRequest(newRequest);
    }
  }, [request, relationship, profile, followProfile]);

  return (
    <>
      <section className="hide-scrollbar container mx-auto h-screen max-w-2xl overflow-y-scroll py-16 ">
        {profile ? (
          <ProfileHeader
            onCancelClick={handleCancelClick}
            onEditClick={() => setModal("profile-edit")}
            onFollowClick={handleFollowClick}
            profile={profile}
            isUser={!!userProfile && profile.id === userProfile.id}
            isFollowing={!!relationship}
            hasRequest={!!request}
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
      include: {
        followers: {
          where: {
            type: RelationshipType.FOLLOW,
          },
        },
        following: {
          where: {
            type: RelationshipType.FOLLOW,
          },
        },
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
