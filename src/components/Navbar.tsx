import { signOut, useSession } from "next-auth/react";

import DialogMenu from "./DialogMenu";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import LoginModal from "./modals/Login";
import React from "react";
import atoms from "../atoms";
import { useSetAtom } from "jotai";

const Navbar = () => {
  const setModal = useSetAtom(atoms.modal);
  const session = useSession();
  return (
    <>
      <nav className="fixed inset-x-0 top-0 flex h-10 w-full justify-center bg-white/50 py-8 backdrop-blur-md dark:bg-zinc-900/50">
        <div className="container flex items-center justify-between gap-4 px-4">
          <Image
            src={"icons/icon.svg"}
            fill={false}
            width={36}
            height={36}
            alt="Birb Logo"
            priority
          />
          <div className="flex items-center gap-4 ">
            <button type="button" className="rounded-md p-2">
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
                    onClick: () => setModal("profile-edit"),
                    disabled: session.status !== "authenticated",
                  },
                ],
                [
                  {
                    icon: "help-circle",
                    text: "About Birb",
                    onClick: () => setModal("welcome"),
                  },
                  {
                    icon: "settings",
                    text: "Settings",
                    onClick: () => setModal("welcome"),
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
            >
              <FeatherIcon icon="menu" size={24} aria-hidden="true" />
            </DialogMenu>
          </div>
        </div>
      </nav>
      <LoginModal />
    </>
  );
};

export default Navbar;
