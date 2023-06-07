import { useAtomValue, useSetAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";

import { LogIn, LogOut, Menu, Search, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { DEFAULT_AVATAR_URL } from "~/server/db/schema/constants";
import atoms from "../atoms";
import DialogMenu from "./DialogMenu";
import { KEY as LOGIN_KEY } from "./modals/Login";
import { KEY as SEARCH_KEY } from "./modals/Search";

interface NavbarProps {
  brandEl?: JSX.Element;
}

const Navbar: React.FC<NavbarProps> = ({ brandEl }) => {
  const profile = useAtomValue(atoms.profile);
  const router = useRouter();
  const setModal = useSetAtom(atoms.modal);
  const session = useSession();
  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex h-10 w-full justify-center bg-white/50 py-8 backdrop-blur-md dark:bg-zinc-900/50">
      <div className="flex w-full items-center justify-between gap-4 px-4">
        {brandEl ? (
          <>{brandEl}</>
        ) : (
          <Link href="/">
            <Image
              src={"/icons/icon.svg"}
              fill={false}
              width={36}
              height={36}
              alt="Birb Logo"
              priority
            />
          </Link>
        )}

        <div className="flex items-center gap-4 ">
          <button
            type="button"
            className="rounded-md p-2"
            onClick={() => setModal(SEARCH_KEY)}
          >
            <Search size={24} className="text-black dark:text-white" />
          </button>
          <DialogMenu
            items={[
              [
                {
                  icon: User,
                  text: profile?.name ?? "Profile",
                  onClick: () => {
                    if (profile) router.push(`/@/${profile.handle}`);
                  },
                  disabled: session.status !== "authenticated",
                },
              ],
              [
                {
                  icon: Settings,
                  text: "Settings",
                  onClick: () => router.push("/settings"),
                  disabled: session.status !== "authenticated",
                },
                {
                  icon: session.status === "authenticated" ? LogOut : LogIn,
                  text:
                    session.status === "authenticated" ? "Log Out" : "Log In",
                  onClick:
                    session.status === "authenticated"
                      ? signOut
                      : () => setModal(LOGIN_KEY),
                },
              ],
            ]}
          >
            {profile ? (
              <div className="h-8 w-8 overflow-hidden rounded-full border border-zinc-800 object-center">
                <Image
                  src={profile.avatarUrl || DEFAULT_AVATAR_URL}
                  alt={`${profile.name}'s avatar image`}
                  className="h-full w-full object-cover object-center"
                  width={96}
                  height={96}
                />
              </div>
            ) : (
              <Menu
                aria-hidden
                className="text-black dark:text-white"
                size={24}
              />
            )}
          </DialogMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
