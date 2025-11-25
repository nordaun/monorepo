import config from "@repo/config";
import prisma from "@repo/database";
import ky from "ky";
import { redirect } from "next/navigation";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CREDENTIALS_ID;
const googleClientSecret = process.env.GOOGLE_CREDENTIALS_SECRET;
const googleRedirectUrl = `${config.urls.main}/api/auth/google`;

type Result = {
  success: boolean;
  userId?: string;
};

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
};

type GoogleEmailResponse = {
  id: string;
  email: string;
  verified_email: boolean;
  picture: string;
};

async function getGoogleToken({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<GoogleTokenResponse> {
  return await ky
    .post("https://oauth2.googleapis.com/token", {
      json: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      },
    })
    .json<GoogleTokenResponse>();
}

async function getGoogleEmail({
  accessToken,
  tokenType,
}: {
  accessToken: string;
  tokenType: string;
}): Promise<GoogleEmailResponse> {
  return await ky
    .get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    })
    .json<GoogleEmailResponse>();
}

export function triggerGoogleLogin() {
  if (!googleClientId || !googleRedirectUrl)
    throw new Error("Google OAuth credentials are not configured");
  const thirdPartyUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleClientId)}&redirect_uri=${encodeURIComponent(googleRedirectUrl)}&response_type=code&scope=email profile`;
  redirect(thirdPartyUrl);
}

export async function handleGoogleLogin({
  code,
}: {
  code: string;
}): Promise<Result> {
  if (!googleClientId || !googleClientSecret || !googleRedirectUrl)
    return { success: false };
  try {
    const { access_token, token_type } = await getGoogleToken({
      code: code,
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      redirectUri: googleRedirectUrl,
    });

    if (!access_token) return { success: false };
    const { email } = await getGoogleEmail({
      accessToken: access_token,
      tokenType: token_type,
    });

    if (!email) return { success: false };
    const user = await prisma.user.findFirst({
      where: { email: email },
      select: { id: true },
    });
    if (!user?.id) return { success: false };

    return { success: true, userId: user.id };
  } catch {
    return { success: false };
  }
}
