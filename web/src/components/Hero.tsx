import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="w-full space-y-12 px-4 py-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-wide text-violet-700 dark:text-violet-400 md:text-4xl">
          Birb - Simple Social
        </h3>
        <h4 className="text-3xl font-bold text-zinc-700 dark:text-zinc-400 md:text-6xl">
          Share your authentic self in a healthier way
        </h4>
      </div>

      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="relative">
          <div className="h-48 w-48 shrink-0 overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1619970096024-c7b438a3b82a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fHNlbGZpZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1800&q=60"
              alt="Photo of young woman taking a selfie"
              className="w-full"
              width={1920}
              height={1080}
            />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform rounded-full bg-violet-700 p-3 text-white shadow-lg shadow-violet-700/50 dark:bg-violet-400 dark:text-black">
            <FeatherIcon icon="aperture" size={28} />
          </div>
        </div>

        <div className="my-auto flex h-full w-full flex-col items-center justify-center space-y-2 text-2xl font-semibold">
          <h5 className="text-zinc-500 dark:text-zinc-400">Take a photo</h5>
          <h5>Share it with your friends</h5>
          <h5 className="text-violet-700 dark:text-violet-400">
            Repeat tomorrow
          </h5>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-full border-b border-zinc-300 dark:border-zinc-700" />
        <p className="text-xl font-bold text-zinc-400 dark:text-zinc-600 md:text-2xl">
          &amp;
        </p>
        <div className="w-full border-b border-zinc-300 dark:border-zinc-700" />
      </div>

      <div className="flex flex-col items-start gap-8 md:flex-row">
        <div className="my-auto flex h-full w-full flex-col items-center justify-center space-y-2 text-2xl font-semibold">
          <h5 className="text-zinc-500 dark:text-zinc-400">Take a thought</h5>
          <h5 className="text-zinc-500 dark:text-zinc-400">Type it out</h5>
          <h5>Share it with your friends</h5>
          <h5 className="text-violet-700 dark:text-violet-400 ">
            Up to 3 times a day
          </h5>
        </div>
        <div className="mx-auto hidden items-center justify-center md:mx-0 md:flex">
          <div className="flex w-48 flex-col items-center space-y-2 md:items-end">
            <div className="h-6 w-full rounded bg-zinc-400 dark:bg-zinc-600" />
            <div className="h-6 w-1/2 rounded bg-zinc-400 dark:bg-zinc-600" />
            <div className="h-6 w-3/4 rounded bg-zinc-400 dark:bg-zinc-600" />
            <div className="h-6 w-full rounded bg-zinc-400 dark:bg-zinc-600" />
            <div className="h-6 w-5/6 rounded bg-zinc-400 dark:bg-zinc-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
