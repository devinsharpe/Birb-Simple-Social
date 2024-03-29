import React, { useEffect, useRef, useState } from "react";

import { useSetAtom } from "jotai";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import type { Profile } from "~/server/db/schema/app";
import { DEFAULT_AVATAR_URL } from "~/server/db/schema/constants";
import atoms from "../../atoms";
import { trpc } from "../../utils/trpc";
import DialogModal from "../DialogModal";

export const KEY = "search";

const ProfileSearchItem: React.FC<{
  onClick: (handle: string) => void;
  profile: Profile;
}> = ({ onClick, profile }) => {
  return (
    <div
      className="group flex cursor-pointer items-center gap-4 rounded-md border border-zinc-300 bg-zinc-100 p-2 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600"
      onClick={() => onClick(profile.handle)}
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
        <Image
          src={profile.avatarUrl || DEFAULT_AVATAR_URL}
          alt={`${profile.name}'s avatar image`}
          className="h-full w-full object-cover object-center"
          width={128}
          height={128}
        />
      </div>
      <div className="w-full">
        <h2 className="text font-medium group-hover:underline">
          {profile.name}
        </h2>
        <h3 className="text-sm font-light text-zinc-600 dark:text-zinc-400">
          @{profile.handle}
        </h3>
      </div>
    </div>
  );
};

const SearchModal = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchProfiles = trpc.profiles.searchProfiles.useMutation();
  const router = useRouter();
  const setModal = useSetAtom(atoms.modal);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (value) {
      timeout = setTimeout(() => {
        searchProfiles
          .mutateAsync(value)
          .then((profiles) => setProfiles(profiles));
      }, 250);
    } else {
      setProfiles([]);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
      searchProfiles.reset();
      setProfiles([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <DialogModal
      initialFocusRef={inputRef}
      name={KEY}
      title="Find your friends on Birb"
      position="top"
    >
      <>
        <div className="relative">
          <span className="absolute left-3 top-0 bottom-0 flex items-center">
            <Search size={16} />
          </span>
          <input
            type="text"
            ref={inputRef}
            className={`w-full rounded-md  bg-transparent pl-8 text-zinc-800 focus:border-violet-600 dark:text-white dark:focus:border-violet-400`}
            placeholder="Search Birb"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="space-y-2 pt-2">
          {profiles.map((profile) => (
            <ProfileSearchItem
              key={profile.id}
              onClick={(handle) => {
                setModal(undefined);
                router.push(`/@/${handle}`);
              }}
              profile={profile}
            />
          ))}
        </div>
      </>
    </DialogModal>
  );
};

export default SearchModal;
