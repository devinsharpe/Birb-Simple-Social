import React, { useCallback, useEffect, useState } from "react";

import DialogModal from "../DialogModal";
import { useAtom } from "jotai";
import { Camera } from "lucide-react";
import type { Profile } from "~/server/db/schema/app";
import atoms from "../../atoms";
import useToasts from "../../hooks/toasts";
import { trpc } from "../../utils/trpc";
import ProfileForm from "../forms/Profile";

export const KEY = "profile-edit";

const ProfileModal = () => {
  const [profileAtom, setProfileAtom] = useAtom(atoms.profile);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [modal, setModal] = useAtom(atoms.modal);
  const saveProfileMutation = trpc.profiles.updateProfile.useMutation();
  const { addToast } = useToasts();

  useEffect(() => {
    if (modal === "profile-edit" && profileAtom) {
      setProfile(profileAtom);
    }
  }, [modal, profileAtom]);

  const saveProfile = useCallback(async () => {
    if (profile) {
      const newProfile = await saveProfileMutation.mutateAsync({
        name: profile.name,
        handle: profile.handle,
        biography: profile.biography || "",
        location: profile.location || "",
        birthdate: profile.birthdate || "",
        website: profile.website || "",
        avatarUrl: profile.avatarUrl || "",
        headerUrl: profile.headerUrl || "",
      });
      if (newProfile) setProfileAtom(newProfile);
      setModal(undefined);
      addToast({
        id: "profile-update",
        content: "Looking good!",
        icon: Camera,
      });
    }
  }, [profile, saveProfileMutation, setModal, setProfileAtom, addToast]);

  return (
    <>
      {profile && (
        <DialogModal
          isDismissable={!profile.canChangeHandle}
          name={KEY}
          title={profile.canChangeHandle ? "Create Profile" : "Edit Profile"}
        >
          <ProfileForm
            onSubmit={saveProfile}
            isLoading={saveProfileMutation.isLoading}
            onChange={(val) => setProfile({ ...val })}
            profile={profile}
          />
        </DialogModal>
      )}
    </>
  );
};

export default ProfileModal;
