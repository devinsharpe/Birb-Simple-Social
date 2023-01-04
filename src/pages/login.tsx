import { signIn, useSession } from "next-auth/react";

import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import React from "react";
import Redirect from "../components/Redirect";

const LoginPage: NextPage = () => {
  const { data: sessionData } = useSession();
  if (sessionData) return <Redirect href="/" />;
  return (
    <main className="flex h-full items-stretch">
      <section className="flex h-full w-full flex-col items-center justify-between">
        <div className="relative h-32 w-full shrink-0 bg-zinc-200 dark:bg-zinc-800">
          <div className="z-1 absolute left-1/2 right-1/2 -bottom-8 flex h-16 w-16 -translate-x-1/2 transform items-center justify-center rounded-full border-2 bg-white">
            <Image
              src={"icons/icon.svg"}
              fill={false}
              width={36}
              height={36}
              alt="Birb Logo"
            />
          </div>
        </div>
        <div className="w-full grow space-y-4 py-24 px-4">
          <Link href="/">
            <h3 className="pb-4 text-center text-3xl font-bold tracking-wide underline">
              Birb &ndash; Simple Social
            </h3>
          </Link>

          <button
            onClick={() => signIn("apple")}
            className="mx-auto flex w-full max-w-md items-center justify-center space-x-2 rounded-md border-2 border-zinc-800 bg-zinc-800 py-4 px-6 text-white hover:border-zinc-700 hover:bg-zinc-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              viewBox="0 0 814 1000"
              height={20}
            >
              <path
                d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
                fill="currentColor"
              />
            </svg>
            <span className="font-semibold">Sign In With Apple</span>
          </button>
          <button
            onClick={() => signIn("google")}
            className="mx-auto box-border flex w-full max-w-md items-center justify-center space-x-2 rounded-md border-2 border-zinc-800 bg-white py-4 px-6 text-zinc-900 shadow-sm hover:border-zinc-800 hover:bg-zinc-200 dark:border-white dark:hover:border-zinc-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height={20}
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            <span className="font-semibold">Sign In With Google</span>
          </button>
          <button className="mx-auto flex items-center justify-center space-x-2 rounded-md bg-zinc-200 py-2 px-4 text-zinc-800 ">
            <FeatherIcon icon="help-circle" size={20} />
            <span className="text-sm">Single Sign On?</span>
          </button>
        </div>

        <div className="space-y-2 py-4 text-zinc-600 dark:text-zinc-300">
          <p className="text-center text-sm">
            <Link href="/terms" className="underline">
              Terms &amp; Conditions
            </Link>
            &emsp;
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>
          <p className="text-center text-sm">&copy;Birb Social, 2023</p>
        </div>
      </section>
      <section className="hidden h-full w-full bg-zinc-800 lg:block"></section>
    </main>
  );
};

export default LoginPage;
