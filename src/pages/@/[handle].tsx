import { GetServerSideProps, NextPage } from "next";
import { useAtomValue, useSetAtom } from "jotai";

import FeatherIcon from "feather-icons-react";
import LoginPrompt from "../../components/LoginPrompt";
import Navbar from "../../components/Navbar";
import { Profile } from "@prisma/client";
import React from "react";
import atoms from "../../atoms";
import { prisma } from "../../server/db/client";
import { useSession } from "next-auth/react";

interface PageProps {
  profile: Profile | null;
}

const ProfileHeader: React.FC<{
  isEditable?: boolean;
  onEditClick: () => void;
  profile: Profile;
}> = ({ isEditable = false, onEditClick, profile }) => {
  return (
    <>
      <div className="relative mx-auto mb-16">
        <div className="relative aspect-[7/3] w-full overflow-hidden sm:rounded-md">
          <img
            src={
              profile.headerUrl ||
              "https //source.unsplash.com/random/600×600/?cat"
            }
            alt={`${profile.name}'s header image`}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="absolute inset-x-0 -bottom-12 left-1/2 z-[1] h-28 w-28 -translate-x-1/2 transform overflow-hidden rounded-full border-4 border-white object-center dark:border-zinc-800">
          <img
            src={
              profile.avatarUrl ||
              "https //source.unsplash.com/random/600×600/?cat"
            }
            alt={`${profile.name}'s avatar image`}
            className="h-full w-full object-cover object-center"
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
        {isEditable ? (
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 dark:hover:bg-violet-500"
            onClick={onEditClick}
          >
            <FeatherIcon icon="user" size={20} />
            <span>Edit</span>
          </button>
        ) : (
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 dark:hover:bg-violet-500"
          >
            <FeatherIcon icon="zap" size={20} />
            <span>Follow</span>
          </button>
        )}
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

const ProfilePage: NextPage<PageProps> = ({ profile }) => {
  const session = useSession();
  const userProfile = useAtomValue(atoms.profile);
  const setModal = useSetAtom(atoms.modal);
  console.log(profile);

  return (
    <>
      <section className="hide-scrollbar container mx-auto h-screen max-w-2xl overflow-y-scroll py-16 ">
        {profile && (
          <ProfileHeader
            isEditable={userProfile && userProfile.id === profile.id}
            onEditClick={() => setModal("profile-edit")}
            profile={profile}
          />
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
  let profile = null;
  if (context.params && context.params?.handle) {
    profile = await prisma.profile.findFirst({
      where: {
        handle: context.params.handle as string,
      },
    });
  }
  return {
    props: {
      profile,
    },
  };
};

export default ProfilePage;
