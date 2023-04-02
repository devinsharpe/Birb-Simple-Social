import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter } from "@next/font/google";
import FeatherIcon from "feather-icons-react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
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

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const profile = useAtomValue(atoms.profile);
  const setModal = useSetAtom(atoms.modal);
  return (
    <>
      <Head>
        <link rel="icon" href="/icons/icon.svg" />
        <meta property="og:site_name" content="Birb - Simple Social" />
      </Head>
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

        <main className="min-h-screen">
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
