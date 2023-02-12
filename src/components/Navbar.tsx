import { signOut, useSession } from "next-auth/react";

import DialogMenu from "./DialogMenu";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import LoginModal from "./modals/login";
import React from "react";
import atoms from "../atoms";
import { useSetAtom } from "jotai";

const Navbar = () => {
  const setModal = useSetAtom(atoms.modal);
  const session = useSession();
  return (
    <>
      <nav className="mt-4 flex h-10 w-full justify-center">
        <div className="container flex items-center justify-between gap-4 px-4">
          <Image
            src={"icons/icon.svg"}
            fill={false}
            width={36}
            height={36}
            alt="Birb Logo"
          />
          <div className="flex items-center gap-4 ">
            <button
              type="button"
              aria-label="Search button"
              className="rounded-lg p-1 text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white"
            >
              <FeatherIcon icon="search" size={24} />
            </button>
            <DialogMenu
              items={[
                [
                  {
                    icon: "home",
                    text: "Home",
                    onClick: console.log,
                  },
                  {
                    icon: "users",
                    text: "Circles",
                    onClick: console.log,
                    disabled: session.status !== "authenticated",
                  },
                  {
                    icon: "bell",
                    text: "Notifications",
                    onClick: console.log,
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
                    onClick: console.log,
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
                    icon:
                      session.status === "authenticated" ? "log-out" : "log-in",
                    text:
                      session.status === "authenticated" ? "Log Out" : "Log In",
                    onClick:
                      session.status === "authenticated"
                        ? signOut
                        : () => setModal("login"),
                  },
                ],
              ]}
            />
          </div>
        </div>
      </nav>
      <LoginModal />
    </>
  );
};

export default Navbar;
