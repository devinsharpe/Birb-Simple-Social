import FeatherIcon from "feather-icons-react";
import { KEY as LOGIN_KEY } from "../modals/Login";
import Link from "next/link";
import { KEY as POST_KEY } from "../modals/Post";
import React from "react";
import { KEY as WELCOME_KEY } from "../modals/Welcome";
import { signOut } from "next-auth/react";

interface SecondaryNavProps {
  onModalClick: (modal: string) => void;
  profileHandle?: string;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({
  onModalClick,
  profileHandle,
}) => {
  return (
    <>
      <nav className="fixed flex-col items-start justify-between hidden py-2 mx-auto bottom-4 top-20 left-4 lg:flex">
        <div className="">
          <Link className="flex items-center gap-2 px-6 py-3" href="/">
            <FeatherIcon icon="home" size={20} className="shrink-0" />
            <span className="whitespace-nowrap">Home</span>
          </Link>

          {profileHandle && (
            <>
              <Link
                className="flex items-center gap-2 px-6 py-3"
                href="/notifications"
              >
                <FeatherIcon icon="bell" size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Notifications</span>
              </Link>
              <Link
                className="flex items-center gap-2 px-6 py-3 opacity-50"
                href="/"
                aria-disabled
              >
                <FeatherIcon
                  icon="message-circle"
                  size={20}
                  className="shrink-0"
                />
                <span className="whitespace-nowrap">Messages</span>
              </Link>
              <Link
                className="flex items-center gap-2 px-6 py-3"
                href={`/@/${profileHandle}`}
              >
                <FeatherIcon icon="user" size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Profile</span>
              </Link>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-3"
                onClick={() => onModalClick(POST_KEY)}
              >
                <FeatherIcon icon="edit-3" size={20} className="shrink-0" />
                <span className="whitespace-nowrap">New Post</span>
              </button>
            </>
          )}
        </div>
        <div>
          {profileHandle && (
            <>
              <Link
                className="flex items-center gap-2 px-6 py-3"
                href="/settings"
              >
                <FeatherIcon icon="settings" size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Settings</span>
              </Link>
            </>
          )}

          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3"
            onClick={() => onModalClick(WELCOME_KEY)}
          >
            <FeatherIcon icon="help-circle" size={20} className="shrink-0" />
            <span className="whitespace-nowrap">About Birb</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3"
            onClick={() =>
              profileHandle ? signOut() : onModalClick(LOGIN_KEY)
            }
          >
            {profileHandle ? (
              <>
                <FeatherIcon icon="log-out" size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Log Out</span>
              </>
            ) : (
              <>
                <FeatherIcon icon="log-in" size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Log In</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {profileHandle && (
        <nav className="fixed inset-x-0 bottom-0 z-[3] flex w-full items-center justify-around bg-white/50 py-2 px-4 pr-24 backdrop-blur-md dark:bg-zinc-900/50 lg:hidden">
          <Link
            href="/"
            className="p-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <FeatherIcon size={24} icon="home" />
          </Link>
          <Link
            href="/notifications"
            className="p-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <FeatherIcon size={24} icon="bell" />
          </Link>
          <Link
            href={`/@/${profileHandle}`}
            className="p-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <FeatherIcon size={24} icon="user" />
          </Link>
        </nav>
      )}
    </>
  );
};

export default SecondaryNav;
