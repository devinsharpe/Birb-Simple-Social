import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter } from "@next/font/google";
import FeatherIcon from "feather-icons-react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import "../styles/nprogress.css";
import React from "react";
import Head from "next/head";
import ProfileAtomProvider from "../components/providers/ProfileAtom";
import ProfileModal from "../components/modals/Profile";
import WelcomeModal from "../components/modals/Welcome";
import SearchModal from "../components/modals/Search";
import LoginModal from "../components/modals/Login";
import { useAtomValue, useSetAtom } from "jotai";
import atoms from "../atoms";
import PostModal, { KEY as POST_KEY } from "../components/modals/Post";
import { DevTools } from "jotai-devtools";
import ThemeProvider from "../components/providers/Theme";
import NProgressProvider from "../components/providers/NProgress";
import ReactionsAtomProvider from "../components/providers/ReactionsAtom";
import { env } from "../env/client.mjs";
import SecondaryNav from "../components/navigation/SecondaryNav";
import ToastsAtomProvider from "../components/providers/ToastsAtom";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
  router,
}) => {
  const profile = useAtomValue(atoms.profile);
  const setModal = useSetAtom(atoms.modal);
  return (
    <>
      <Head>
        <link rel="icon" href="/icons/icon.svg" />
        <meta property="og:site_name" content="Birb - Simple Social" />
        <title>Birb - Simple Social</title>
        <meta
          name="description"
          content="Birb, a different type of social network"
        />
      </Head>
      {env.NEXT_PUBLIC_ENV === "development" && <DevTools />}
      <SessionProvider session={session}>
        <style jsx global>
          {`
            :root {
              --inter-font: ${inter.style.fontFamily};
            }
          `}
        </style>

        <LoginModal />
        <SearchModal />
        <WelcomeModal />
        <ProfileAtomProvider />
        <ReactionsAtomProvider />
        <ToastsAtomProvider />
        <NProgressProvider router={router} />
        <ThemeProvider />

        {profile && (
          <>
            <ProfileModal />
            <PostModal />
            <button
              type="button"
              className="fixed right-8 bottom-8 z-10 flex items-center justify-center rounded-full bg-violet-600 p-4 text-white shadow-md shadow-violet-700/50 transition-colors duration-100 hover:bg-violet-700 focus:bg-violet-700"
              onClick={() => setModal(POST_KEY)}
            >
              <FeatherIcon icon="edit-3" size={24} />
            </button>
          </>
        )}

        <main className="hide-scrollbar mx-auto h-screen max-w-2xl overflow-y-scroll pt-16">
          <Component {...pageProps} />
          <div className="mt-auto flex items-center justify-center border-t border-zinc-300 pt-16 pb-4 opacity-50 dark:border-zinc-600">
            <p className="text-sm">
              made with ❤️ by&nbsp;
              <a
                href="https://www.devsharpe.io/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                devsharpe
              </a>
              &nbsp;& Gary 🦆
            </p>
          </div>
        </main>

        <SecondaryNav onModalClick={setModal} profileHandle={profile?.handle} />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
