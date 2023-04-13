import type { ChangeEvent, MouseEvent } from "react";
import React, { useCallback, useRef, useState } from "react";

import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import type { Profile } from "@prisma/client";
import TextInput from "../inputs/Text";
import { trpc } from "../../utils/trpc";
import { useS3Upload } from "next-s3-upload";

const ProfileForm: React.FC<{
  isLoading: boolean;
  profile: Profile;
  onChange: (profile: Profile) => void;
  onSubmit: () => void;
}> = ({ isLoading, profile, onChange, onSubmit }) => {
  const [isValidHandle, setIsValidHandle] = useState(true);
  const checkProfileHandle = trpc.profiles.checkProfileHandle.useMutation();
  const checkHandle = useCallback(async () => {
    const isValid = await checkProfileHandle.mutateAsync(profile.handle);
    setIsValidHandle(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.handle]);
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const headerRef = useRef<HTMLInputElement | null>(null);

  const [currentPicKey, setCurrentPicKey] = useState<
    "avatarUrl" | "headerUrl" | undefined
  >(undefined);
  const { uploadToS3 } = useS3Upload();

  const resetFiles = () => {
    if (avatarRef.current && headerRef.current) {
      avatarRef.current.value = "";
      headerRef.current.value = "";
    }
  };

  const handleClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    key: "avatarUrl" | "headerUrl"
  ) => {
    setCurrentPicKey(key);
    if (key === "avatarUrl") avatarRef.current?.click();
    if (key === "headerUrl") headerRef.current?.click();
  };

  const handleUploadClick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleFileChange = async (file: File) => {
    const blob = file.slice(0, file.size, file.type);
    const filename = `${crypto.randomUUID()}.${file.type.split("/")[1]}`;
    const { url } = await uploadToS3(
      new File([blob], filename, {
        type: file.type,
      })
    );
    if (currentPicKey) onChange({ ...profile, [currentPicKey]: url });
    resetFiles();
    setCurrentPicKey(undefined);
  };

  return (
    <>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (isValidHandle) onSubmit();
        }}
      >
        <div className="relative mb-16">
          <div className="relative aspect-[7/3] w-full overflow-hidden rounded-md ">
            <Image
              src={
                profile.headerUrl ||
                "https //source.unsplash.com/random/600×600/?cat"
              }
              width={2520}
              height={1080}
              alt={`${profile.name}'s header image`}
              className="h-full w-full object-cover object-center"
            />
            <button
              type="button"
              className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-zinc-900 bg-opacity-50 text-white"
              onClick={(e) => handleClick(e, "headerUrl")}
            >
              {currentPicKey === "headerUrl" ? (
                <FeatherIcon icon="loader" className="animate-spin" />
              ) : (
                <FeatherIcon icon="camera" />
              )}
            </button>
          </div>

          <div className="absolute left-4 -bottom-12 z-[1] h-28 w-28 overflow-hidden rounded-full border-4 border-white object-center dark:border-zinc-800">
            <Image
              src={
                profile.avatarUrl ||
                "https //source.unsplash.com/random/600×600/?cat"
              }
              height={128}
              width={128}
              alt={`${profile.name}'s avatar image`}
              className="h-full w-full object-cover object-center"
            />
            <button
              type="button"
              className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-zinc-900 bg-opacity-50 text-white"
              onClick={(e) => handleClick(e, "avatarUrl")}
            >
              {currentPicKey === "avatarUrl" ? (
                <FeatherIcon icon="loader" className="animate-spin" />
              ) : (
                <FeatherIcon icon="camera" />
              )}
            </button>
          </div>
        </div>
        <TextInput
          id="profile-name"
          label="Name"
          maxLength={50}
          name="name"
          onChange={(val) => onChange({ ...profile, name: val })}
          placeholder="Jane Doe"
          value={profile.name}
        />
        <TextInput
          icon={isValidHandle ? "at-sign" : "x"}
          id="profile-handle"
          isValid={isValidHandle}
          label="Handle"
          name="handle"
          onBlur={() => checkHandle()}
          onChange={(val) =>
            onChange({ ...profile, handle: val.toLowerCase().slice(0, 24) })
          }
          value={profile.handle}
          disabled={!profile.canChangeHandle}
          maxLength={24}
        />
        <TextInput
          id="profile-biography"
          isTextArea
          label="Biography"
          maxLength={300}
          name="biography"
          onChange={(val) =>
            onChange({ ...profile, biography: val.slice(0, 300) })
          }
          placeholder="It was the best of times. It was the worst of times..."
          value={profile.biography || ""}
        />
        <TextInput
          icon={"map-pin"}
          id="profile-location"
          label="Location"
          maxLength={50}
          name="location"
          onChange={(val) =>
            onChange({ ...profile, location: val.slice(0, 50) })
          }
          placeholder="Downtown Abbey"
          value={profile.location || ""}
        />
        <TextInput
          id="profile-birthdate"
          label="Birthday"
          name="birthdate"
          onChange={(val) => onChange({ ...profile, birthdate: val })}
          value={profile.birthdate || new Date().toLocaleDateString()}
          icon="gift"
          type="date"
        />
        <TextInput
          icon="link"
          id="profile-website"
          label="Website"
          name="website"
          onChange={(val) => onChange({ ...profile, website: val })}
          placeholder="www.birb.social"
          value={profile.website || ""}
        />
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="relative rounded-full bg-zinc-800 px-10 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-100"
          >
            <span className={`${isLoading && "text-transparent"}`}>Save</span>
            {isLoading && (
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ">
                <FeatherIcon
                  icon="loader"
                  className="animate-spin text-white dark:text-zinc-800"
                  size={16}
                />
              </span>
            )}
          </button>
        </div>
        <div className="hidden">
          <input
            accept="image/png, image/jpeg, image/jpg"
            id="profile-avatar"
            name="avatar"
            onChange={handleUploadClick}
            ref={avatarRef}
            type="file"
          />
          <input
            accept="image/png, image/jpeg, image/jpg"
            id="profile-header"
            name="header"
            onChange={handleUploadClick}
            ref={headerRef}
            type="file"
          />
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
