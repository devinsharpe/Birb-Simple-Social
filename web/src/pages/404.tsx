import { Home } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";

const Custom404Page: NextPage = () => {
  return (
    <>
      <section className="space-y-4 pb-8">
        <h3 className="text-3xl font-bold tracking-wide md:text-6xl">404</h3>
        <p className="text-lg">🦆 You seem to be a little lost here...</p>
        <div className="flex">
          <Link
            href="/"
            className="relative flex items-center gap-2 rounded-full bg-zinc-800 px-6 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-100"
          >
            <Home />
            <span>Return Home</span>
          </Link>
        </div>
      </section>
      <Navbar />
    </>
  );
};

export default Custom404Page;
