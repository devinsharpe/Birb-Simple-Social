// TODO: Update next font import
import { Inter } from "@next/font/google";
import { Edit3 } from "lucide-react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { trpc } from "../utils/trpc";

import { useAtomValue, useSetAtom } from "jotai";
import Head from "next/head";
import React from "react";
import atoms from "../atoms";
import LoginModal from "../components/modals/Login";
import PostModal, { KEY as POST_KEY } from "../components/modals/Post";
import ProfileModal from "../components/modals/Profile";
import SearchModal from "../components/modals/Search";
import WelcomeModal from "../components/modals/Welcome";
import ProfileAtomProvider from "../components/providers/ProfileAtom";
import "../styles/globals.css";
import "../styles/nprogress.css";
import dynamic from "next/dynamic";
import { env } from "~/env.mjs";
import SecondaryNav from "../components/navigation/SecondaryNav";
import NProgressProvider from "../components/providers/NProgress";
import ReactionsAtomProvider from "../components/providers/ReactionsAtom";
import ThemeProvider from "../components/providers/Theme";
import ToastsAtomProvider from "../components/providers/ToastsAtom";

const JotaiDevtools = dynamic(
  async () => {
    if (env.NODE_ENV === "development") {
      const { DevTools } = await import("jotai-devtools");
      return DevTools;
    }
    const stub = () => <p className="hidden">Jotai Devtools Stub</p>;
    stub.displayName = "Jotai Devtools Stub";
    return stub;
  },
  { ssr: false }
);

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
      {/* {env.NEXT_PUBLIC_ENV === "development" && <DevTools />} */}
      <JotaiDevtools />
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
              <Edit3 size={24} />
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
