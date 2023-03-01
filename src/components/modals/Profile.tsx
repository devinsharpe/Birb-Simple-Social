import React, { useCallback, useEffect, useState } from "react";

import DialogModal from "../DialogModal";
import type { Profile } from "@prisma/client";
import ProfileForm from "../forms/Profile";
import atoms from "../../atoms";
import { trpc } from "../../utils/trpc";
import { useAtom } from "jotai";

const ProfileModal = () => {
  const [profileAtom, setProfileAtom] = useAtom(atoms.profile);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [modal, setModal] = useAtom(atoms.modal);
  const saveProfileMutation = trpc.profiles.updateProfile.useMutation();

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
      setProfileAtom(newProfile || profileAtom);
      setModal(undefined);
    }
  }, [profile, profileAtom, saveProfileMutation, setModal, setProfileAtom]);

  return (
    <>
      {profile && (
        <DialogModal
          isDismissable={!profile.canChangeHandle}
          name="profile-edit"
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
