import { useAtomValue, useSetAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";

import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import atoms from "../atoms";
import DialogMenu from "./DialogMenu";
import { KEY as LOGIN_KEY } from "./modals/Login";
import { KEY as SEARCH_KEY } from "./modals/Search";
import { KEY as WELCOME_KEY } from "./modals/Welcome";

interface NavbarProps {
  brandEl?: JSX.Element;
}

const Navbar: React.FC<NavbarProps> = ({ brandEl }) => {
  const profile = useAtomValue(atoms.profile);
  const router = useRouter();
  const setModal = useSetAtom(atoms.modal);
  const session = useSession();
  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-10 flex h-10 w-full justify-center bg-white/50 py-8 backdrop-blur-md dark:bg-zinc-900/50">
        <div className="container flex items-center justify-between gap-4 px-4">
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
              <FeatherIcon icon="search" size={24} />
            </button>
            <DialogMenu
              items={[
                [
                  {
                    icon: "home",
                    text: "Home",
                    onClick: () => router.push("/"),
                  },
                  {
                    icon: "bell",
                    text: "Notifications",
                    onClick: () => router.push("/notifications"),
                    disabled: session.status !== "authenticated",
                  },
                  {
                    icon: "message-circle",
                    text: "Messages",
                    onClick: console.log,
                    disabled: session.status !== "authenticated",
                  },
                  {
                    icon: "user",
                    text: "Profile",
                    onClick: () => {
                      if (profile) router.push(`/@/${profile.handle}`);
                    },
                    disabled: session.status !== "authenticated",
                  },
                ],
                [
                  {
                    icon: "settings",
                    text: "Settings",
                    onClick: console.log,
                    disabled: session.status !== "authenticated",
                  },
                  {
                    icon: "help-circle",
                    text: "About Birb",
                    onClick: () => setModal(WELCOME_KEY),
                  },
                  {
                    icon:
                      session.status === "authenticated" ? "log-out" : "log-in",
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
              <FeatherIcon icon="menu" size={24} aria-hidden="true" />
            </DialogMenu>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
