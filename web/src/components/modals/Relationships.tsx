import type { Profile, ProfileRelationship } from "@prisma/client";
import React, { useEffect, useState } from "react";

import DialogModal from "../DialogModal";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import Link from "next/link";
import atoms from "../../atoms";
import { trpc } from "../../utils/trpc";
import { useAtom } from "jotai";
import { RelationshipType } from "~/server/db/schema/enums";
import {
  DEFAULT_AVATAR_URL,
  DEFAULT_HEADER_URL,
} from "~/server/db/schema/constants";

export enum KEY_OPTIONS {
  follower = "FOLLOWER",
  following = "FOLLOWING",
}

const ProfileItem: React.FC<{
  onClick: () => void;
  profile: {
    handle: string;
    name: string;
    avatarUrl: string;
  };
}> = ({ onClick, profile }) => {
  return (
    <div className="flex w-full items-center gap-4 px-4 py-2">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
        <Image
          src={profile.avatarUrl}
          className="h-full w-full object-cover object-center"
          alt={`${profile.name}'s avatar image`}
          width={128}
          height={128}
        />
      </div>
      <Link
        href={`/@/${profile.handle}`}
        className="group w-full"
        onClick={onClick}
      >
        <div className="w-full">
          <h5>
            <span className="font-semibold group-hover:underline">
              {profile.name}
            </span>
          </h5>
          <p className="text-xs opacity-75">{profile.handle}</p>
        </div>
      </Link>
    </div>
  );
};

const RelationshipModal: React.FC<{
  profile: {
    id: string;
    name: string;
  };
  type: KEY_OPTIONS;
}> = ({ profile, type }) => {
  const modalKey =
    type === "FOLLOWER" ? "profile-followers" : "profile-following";
  const [modal, setModal] = useAtom(atoms.modal);
  const [relationships, setRelationships] = useState<
    (ProfileRelationship & {
      follower: Profile;
      following: Profile;
    })[]
  >([]);
  const getRelationships = trpc.relationships.list.useMutation();

  useEffect(() => {
    if (modal === modalKey) {
      getRelationships
        .mutateAsync({
          type: RelationshipType.Follow,
          id: profile.id,
          rel: type,
        })
        .then((rels) => setRelationships(rels));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, modalKey, profile.id, type]);

  return (
    <DialogModal
      title={`${profile.name} ${
        type === "FOLLOWER" ? "Followers" : "Following"
      }`}
      name={modalKey}
    >
      <section className="h-full divide-y divide-zinc-300 overflow-y-auto dark:divide-zinc-600">
        {getRelationships.isLoading ? (
          <div className="flex h-14 w-full items-center justify-center">
            <FeatherIcon icon="loader" className="animate-spin" />
          </div>
        ) : (
          <>
            {relationships.length ? (
              <>
                {relationships.map((relationship) => (
                  <ProfileItem
                    key={relationship.id}
                    onClick={() => setModal(undefined)}
                    profile={
                      type === "FOLLOWER"
                        ? {
                            avatarUrl:
                              relationship.follower.avatarUrl ??
                              DEFAULT_AVATAR_URL,
                            handle: relationship.follower.handle,
                            name: relationship.follower.name,
                          }
                        : {
                            avatarUrl:
                              relationship.following.avatarUrl ??
                              DEFAULT_HEADER_URL,
                            handle: relationship.following.handle,
                            name: relationship.following.name,
                          }
                    }
                  />
                ))}
              </>
            ) : (
              <div className="">
                <h4 className="text-lg font-bold text-black dark:text-white md:text-2xl">
                  Uh oh! We didn&apos;t find anyone here
                </h4>
                <h5 className="font-medium text-zinc-700 dark:text-zinc-400 md:text-lg">
                  It seems like someone has room for friends
                </h5>
              </div>
            )}
          </>
        )}
      </section>
    </DialogModal>
  );
};

export default RelationshipModal;
