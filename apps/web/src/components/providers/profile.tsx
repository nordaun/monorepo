"use client";

import { Profile } from "@/auth/definitions";
import { pusherClient } from "@repo/socket";
import { createContext, ReactNode, useEffect, useState } from "react";

type SessionContext = {
  profile: Profile;
};

const defaultProfile: Profile = {
  id: "",
  name: "",
  username: "",
  avatarUrl: null,
};

const defaultContext: SessionContext = {
  profile: defaultProfile,
};

export const SessionContext = createContext<SessionContext>(defaultContext);

export default function SessionProvider({
  initialProfile,
  children,
}: {
  initialProfile: Profile;
  children: ReactNode;
}) {
  const [profile, setProfile] = useState<Profile>(initialProfile);

  useEffect(() => {
    pusherClient
      .subscribe(profile.id)
      .bind("profile-update", (profile: Profile) => {
        setProfile(profile);
      })
      .bind("avatar-update", (avatarUrl: string) => {
        setTimeout(() => setProfile((prev) => ({ ...prev, avatarUrl })), 500);
      });

    return () => pusherClient.unsubscribe(profile.id);
  }, [profile.id]);

  const values: SessionContext = {
    profile,
  };

  return (
    <SessionContext.Provider value={values}>{children}</SessionContext.Provider>
  );
}
