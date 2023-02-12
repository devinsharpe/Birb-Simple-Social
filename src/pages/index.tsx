import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import React from "react";
import Navbar from "../components/Navbar";
import LoginPrompt from "../components/LoginPrompt";

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
      <main className="min-h-screen">
        <Navbar />
        {session.status !== "authenticated" && <LoginPrompt />}
      </main>
    </>
  );
};

export default Home;
