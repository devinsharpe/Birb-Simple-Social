import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";

const VerifyPage: NextPage = () => {
  return (
    <>
      <section className="flex items-center gap-4">
        <Link href="/">
          <Image
            src={"/icons/icon.svg"}
            fill={false}
            width={72}
            height={72}
            alt="Birb Logo"
            priority
          />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-violet-700 dark:text-violet-400 md:text-6xl">
            Birb
          </h1>
          <h2 className="text-lg font-light md:text-xl">Simple Social</h2>
        </div>
      </section>
      <section className="space-y-4">
        <h3 className="text-3xl font-bold tracking-wide md:text-6xl">
          What are you still doing here?
        </h3>
        <p className="text-lg">
          We sent a 🪄 magic 🪄 sign in link to your email address. Let&apos;s
          get started on building stronger, more genuine relationships with
          others... but first, we really need you to find that email.
        </p>
        <div className="flex">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-md bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 dark:hover:bg-violet-500"
          >
            <FeatherIcon icon="home" size={20} />
            <span>Return Home</span>
          </Link>
        </div>
      </section>
    </>
  );
};

export default VerifyPage;
