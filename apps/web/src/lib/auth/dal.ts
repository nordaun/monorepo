import "server-only";

import { cache } from "@repo/cache";
import prisma from "@repo/database";
import { LicensePayload, SessionPayload, User } from "./definitions";
import { verifyLicense } from "./licenses";
import { verifySession } from "./sessions";

export const getUser = async (): Promise<Omit<
  User,
  "password" | "otp"
> | null> => {
  const session = await verifySession();
  if (!session?.userId) return null;

  try {
    const user: Omit<User, "password" | "otp"> | null = await cache(
      `user:${session.userId}`,
      await prisma.user.findFirst({
        where: { id: session.userId },
        omit: { password: true, otp: true },
      })
    );
    return user;
  } catch {
    return null;
  }
};

export const getSession = async (): Promise<SessionPayload | null> => {
  const session = await verifySession();
  if (!session?.userId) return null;
  return session;
};

export const getLicense = async (): Promise<LicensePayload | null> => {
  const license = await verifyLicense();
  if (!license?.userId) return null;
  return license;
};
