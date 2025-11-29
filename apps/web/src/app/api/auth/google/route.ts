import { handleGoogleLogin } from "@/auth/methods";
import { cookieName, cookieOptions, encrypt, expiresAt } from "@/auth/sessions";
import { redirect } from "@/i18n/navigation";
import { cookies } from "next/headers";

async function createSession({ userId }: { userId: string }) {
  const session = await encrypt({ userId, expiresAt });
  (await cookies()).set(cookieName, session, cookieOptions);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const paramCode = url.searchParams.get("code");

  if (!paramCode) return await redirect("/account");

  const { success, userId } = await handleGoogleLogin({ code: paramCode });
  if (!success || !userId) return await redirect("/account");

  await createSession({ userId });

  return await redirect("/account");
}
