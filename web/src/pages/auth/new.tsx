import { type NextPage } from "next";
import ProfileForm from "../../components/forms/Profile";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import atoms from "../../atoms";
import { useCallback, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
// import type { Profile } from "@prisma/client";
import type { Profile } from "~/server/db/schema/app";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Redirect from "../../components/Redirect";

const NewUser: NextPage = () => {
  const session = useSession();
  const router = useRouter();
  const [profile, setProfile] = useAtom(atoms.profile);
  const [newProfile, setNewProfile] = useState<Profile | undefined>(undefined);
  const updateProfile = trpc.profiles.updateProfile.useMutation();

  useEffect(() => {
    if (profile) setNewProfile({ ...profile });
  }, [profile]);

  const handleSubmit = useCallback(
    async (p: Profile) => {
      const updatedProfile = await updateProfile.mutateAsync(p);
      if (updatedProfile) {
        setProfile(updatedProfile);
        if (router.query.callbackUrl)
          router.push(router.query.callbackUrl as string);
        else router.push("/");
      }
    },
    [updateProfile, setProfile, router]
  );

  if (session.status === "unauthenticated") return <Redirect href="/" />;
  if (profile && !profile.canChangeHandle)
    return <Redirect href={`/@/${profile.handle}`} />;

  return (
    <div className="px-4 lg:px-0">
      <section className="flex items-center gap-4 pb-8">
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
      <section className="pb-8 space-y-4">
        <h3 className="text-3xl font-bold tracking-wide md:text-6xl">
          Let&apos;s get started on your profile 🪄
        </h3>
      </section>
      <section className="p-4 py-4 mb-8 space-y-4 bg-white rounded-md dark:bg-zinc-800">
        {newProfile && (
          <ProfileForm
            isLoading={updateProfile.isLoading}
            profile={newProfile}
            onChange={(p) => setNewProfile(p)}
            onSubmit={() => handleSubmit(newProfile)}
            submitText="Continue"
          />
        )}
      </section>
    </div>
  );
};

export default NewUser;
