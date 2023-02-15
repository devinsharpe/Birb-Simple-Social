import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter } from "@next/font/google";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import React from "react";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/icons/icon.svg" />
      </Head>
      <SessionProvider session={session}>
        <style jsx global>
          {`
            :root {
              --inter-font: ${inter.style.fontFamily};
            }
          `}
        </style>
        <main className="min-h-screen">
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
