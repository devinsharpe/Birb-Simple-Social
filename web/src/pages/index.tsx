import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import React from "react";
import Navbar from "../components/Navbar";
import LoginPrompt from "../components/LoginPrompt";
import Hero from "../components/Hero";
import DemoPosts from "../components/DemoPosts";
import Timeline from "../components/Timeline";

const Home: NextPage = () => {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Birb - Simple Social</title>
        <meta
          name="description"
          content="Birb, a different type of social network"
        />
      </Head>

      <section className="hide-scrollbar container mx-auto h-full max-w-2xl divide-y divide-zinc-300 overflow-y-scroll py-16 dark:divide-zinc-600">
        {session.status === "unauthenticated" && (
          <>
            <Hero />
            <DemoPosts />
          </>
        )}
        {session.status === "authenticated" && <Timeline />}
      </section>
      <Navbar />
      {session.status === "unauthenticated" && <LoginPrompt />}
    </>
  );
};

export default Home;
