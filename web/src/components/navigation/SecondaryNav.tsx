import {
  Bell,
  Edit3,
  HelpCircle,
  Home,
  LogIn,
  LogOut,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { KEY as LOGIN_KEY } from "../modals/Login";
import { KEY as POST_KEY } from "../modals/Post";
import { KEY as WELCOME_KEY } from "../modals/Welcome";

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
      <nav className="fixed bottom-4 top-20 left-4 mx-auto hidden flex-col items-start justify-between py-2 lg:flex">
        <div className="">
          <Link className="flex items-center gap-2 px-6 py-3" href="/">
            <Home size={20} className="shrink-0" />
            <span className="whitespace-nowrap">Home</span>
          </Link>

          {profileHandle && (
            <>
              <Link
                className="flex items-center gap-2 px-6 py-3"
                href="/notifications"
              >
                <Bell size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Notifications</span>
              </Link>
              <Link
                className="flex items-center gap-2 px-6 py-3 opacity-50"
                href="/"
                aria-disabled
              >
                <MessageCircle size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Messages</span>
              </Link>
              <Link
                className="flex items-center gap-2 px-6 py-3"
                href={`/@/${profileHandle}`}
              >
                <User size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Profile</span>
              </Link>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-3"
                onClick={() => onModalClick(POST_KEY)}
              >
                <Edit3 size={20} className="shrink-0" />
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
                <Settings size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Settings</span>
              </Link>
            </>
          )}

          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3"
            onClick={() => onModalClick(WELCOME_KEY)}
          >
            <HelpCircle size={20} className="shrink-0" />
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
                <LogOut size={20} className="shrink-0" />
                <span className="whitespace-nowrap">Log Out</span>
              </>
            ) : (
              <>
                <LogIn size={20} className="shrink-0" />
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
            className="rounded-full p-3 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <Home size={24} />
          </Link>
          <Link
            href="/notifications"
            className="rounded-full p-3 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <Bell size={24} />
          </Link>
          <Link
            href={`/@/${profileHandle}`}
            className="rounded-full p-3 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <User size={24} />
          </Link>
        </nav>
      )}
    </>
  );
};

export default SecondaryNav;
