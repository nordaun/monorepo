"use server";

import { redirect } from "@/i18n/navigation";
import config from "@repo/config";
import prisma from "@repo/database";
import { sendEmail } from "@repo/email";
import VerifyEmail from "@repo/email/verify";
import { pusherServer } from "@repo/socket";
import { compare, hash } from "bcryptjs";
import { randomInt } from "crypto";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { treeifyError } from "zod";
import { $ZodError as ZodError } from "zod/v4/core";
import { getLicense, getSession } from "./dal";
import {
  AuthState,
  EmailSchema,
  LicensedRoute,
  LicensedRoutes,
  LoginSchema,
  MailParams,
  OtpSchema,
  PasswordSchema,
  Personalizable,
  Personalizables,
  SignupSchema,
} from "./definitions";
import { createLicense, deleteLicense, signLicense } from "./licenses";
import { createSession, deleteSession } from "./sessions";

/**
 * ## Translate
 * Translates an error object's values or string to the user's preferred language.
 * @param properties the translateable string or object
 * @returns A translated string or object
 */
async function t(
  properties: Record<string, { errors: readonly string[] } | undefined> | string
): Promise<AuthState> {
  const translate = await getTranslations("Auth");
  if (typeof properties === "string") return { message: translate(properties) };
  const errors: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value?.errors.length) {
      errors[key] = await Promise.all(
        value.errors.map((message) => translate(message))
      );
    }
  }
  return { errors };
}

/**
 * ## Generate OTP
 * Creates a new one time password that is the current configs length.
 * @returns The generated OTP string
 */
function generateOtp(): string {
  const seed = randomInt(Math.pow(10, config.lengths.otp));
  return seed.toString().padStart(config.lengths.otp, "0");
}

/**
 * ## Get Mail Options
 * Constructs a verify mail object with an OTP attached.
 * @returns The generated mail options.
 */
async function getMailOptions({ name, email, otp, route }: MailParams) {
  const e = await getTranslations("Emails");
  return {
    from: `${config.name} <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
    to: email,
    subject: e(`${LicensedRoutes[route].name}Subject`),
    html: VerifyEmail({
      header: e(`${LicensedRoutes[route].name}Header`, { name }),
      main: e(`${LicensedRoutes[route].name}Main`),
      otp,
      footer: e(`${LicensedRoutes[route].name}Footer`),
    }),
  };
}

/**
 * ## Signup Action
 * Signs a user up.
 * *Requires React's useActionState() hook.*
 * @returns The new state of the server action (errors or a message)
 */
export async function signup(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validFields = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validFields.success)
    return t(treeifyError(validFields.error).properties!);
  const { name, email, username, password } = validFields.data;

  const existingEmail = await prisma.user.count({ where: { email } });
  if (existingEmail > 0) return t("emailTaken");
  const existingUsername = await prisma.user.count({ where: { username } });
  if (existingUsername > 0) return t("usernameTaken");

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: await hash(password, 12),
    },
  });

  if (!newUser.id) return t("unexpectedError");
  await createSession({ userId: newUser.id, redirectUrl: "/account" });
}

/**
 * ## Login Action
 * Logs a user in.
 * *Requires React's useActionState() hook.*
 * @returns The new state of the server action (errors or a message).
 */
export async function login(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validFields.success)
    return t(treeifyError(validFields.error).properties!);
  const { email, password } = validFields.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, password: true, twoFactorAuth: true },
  });

  if (!user?.id || !user?.password) return t("passwordInvalid");
  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch || !user?.id || !user?.password)
    return t("passwordInvalid");

  if (user.twoFactorAuth) {
    const otp = generateOtp();
    const mailOptions = await getMailOptions({
      name: user.name,
      email,
      otp,
      route: "twofactorauth",
    });

    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { otp: await hash(otp, 12) },
      }),
      sendEmail({ mailOptions }),
      createLicense({
        target: "twofactorauth",
        userId: user.id,
        redirectUrl: "/confirm",
      }),
    ]);
  } else await createSession({ userId: user.id, redirectUrl: "/account" });
}

/**
 * Logout Action
 * Logs a user out.
 * *Doesn't require React's useActionState() hook.*
 */
export async function logout() {
  await deleteSession();
  await deleteLicense();
}

/**
 * ## Personalize Action
 * Personalizes user details (e.g.: name, phone) with React's useActionState() hook.
 * *Requires React's useActionState() hook.*
 * @param field The detail the user wants to personalize (e.g.: username).
 * @returns The new state of the server action (errors or a message).
 */
export async function personalize(
  field: Personalizable,
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const session = await getSession();
  if (!session?.userId || !Personalizables[field]) return t("sessionInvalid");

  const validFields = Personalizables[field].schema.safeParse({
    [Personalizables[field].name]: formData.get(Personalizables[field].name),
  });
  if (!validFields.success)
    return t(
      treeifyError(
        validFields.error as ZodError<{
          [key: string]: string;
        }>
      ).properties!
    );

  const value = (validFields.data as Record<Personalizable, string>)[
    Personalizables[field].name
  ];

  if (Personalizables[field].name === "username") {
    const existing = await prisma.user.count({ where: { username: value } });
    if (existing > 0) return t("usernameTaken");
  } else if (Personalizables[field].name === "phone") {
    const existingPhone = await prisma.user.count({ where: { phone: value } });
    if (existingPhone > 0) return t("phoneTaken");
  }

  revalidatePath("/account");

  const profile = await prisma.user.update({
    where: { id: session.userId },
    data: {
      [Personalizables[field].name]: value,
    },
    select: { id: true, name: true, username: true, avatarUrl: true },
  });

  pusherServer.trigger(profile.id, "profile-update", profile);
}

/**
 * ## Verify Action
 * Starts a process that requires email confirmation (license) with an OTP.
 * *Requires React's useActionState() hook.*
 * @param target The process the user wants to start (e.g.: resetPassword).
 * @returns The new state of the server action (errors or a message).
 */
export async function verify(
  target: LicensedRoute,
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!LicensedRoutes[target]) return await redirect("/login");
  const validFields = EmailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validFields.success)
    return t(treeifyError(validFields.error).properties!);
  const { email } = validFields.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true },
  });

  if (!user?.id || !user?.name) return t("emailNotFound");

  const otp = generateOtp();
  const mailOptions = await getMailOptions({
    name: user.name,
    email,
    otp,
    route: target,
  });

  await Promise.all([
    prisma.user.update({
      where: { id: user.id },
      data: { otp: await hash(otp, 12) },
    }),
    sendEmail({ mailOptions }),
    createLicense({
      target,
      userId: user.id,
      redirectUrl: "/confirm",
    }),
  ]);
}

/**
 * ## Confirm Action
 * Confirms that a user is legit with the OTP sent along the verify email.
 * *Requires React's useActionState() hook.*
 * @returns The new state of the server action (errors or a message).
 */
export async function confirm(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const license = await getLicense();
  if (!license?.target || !LicensedRoutes[license.target])
    return t("licenseInvalid");
  const validFields = OtpSchema.safeParse({
    otp: formData.get("otp"),
  });

  if (!validFields.success)
    return t(treeifyError(validFields.error).properties!);
  const { otp } = validFields.data;

  const user = await prisma.user.findUnique({
    where: { id: license.userId },
    select: { id: true, otp: true },
  });

  if (!user?.id || !user?.otp) return t("licenseInvalid");
  const otpMatch = await compare(otp, user.otp);
  if (!otpMatch) return t("otpInvalid");

  const newLicense = await signLicense();
  if (newLicense?.signed !== true) return t("licenseInvalid");
  await createSession({
    userId: user.id,
    redirectUrl: LicensedRoutes[license.target].href,
  });
}

/**
 * ## Reset Password Action
 * Resets (changes) the password of the user (works with license).
 * *Requires React's useActionState() hook.*
 * @returns The new state of the server action (errors or a message).
 */
export async function resetPassword(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const license = await getLicense();
  if (license?.target !== "resetpassword") return t("licenseInvalid");

  if (formData.get("password") !== formData.get("passwordAgain"))
    return t("passwordMismatch");

  const validFields = PasswordSchema.safeParse({
    password: formData.get("password"),
  });
  if (!validFields.success)
    return t(treeifyError(validFields.error).properties!);
  const { password } = validFields.data;

  const existingUser = await prisma.user.count({
    where: { id: license.userId },
  });
  if (existingUser === 0) return t("licenseInvalid");

  await Promise.all([
    prisma.user.update({
      where: { id: license.userId },
      data: { password: await hash(password, 12) },
    }),
    redirect("/account"),
  ]);
}

/**
 * ## Migrate Email Action
 * Migrates (changes) the email of the user (works with license).
 * *Requires React's useActionState() hook.*
 * @returns The new state of the server action (errors or a message).
 */
export async function migrateEmail(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const license = await getLicense();
  if (license?.target !== "migrateemail") return t("licenseInvalid");

  if (formData.get("email") !== formData.get("emailAgain"))
    return t("emailMismatch");

  const validFields = EmailSchema.safeParse({
    email: formData.get("email"),
  });
  if (!validFields.success)
    return t(treeifyError(validFields.error).properties!);
  const { email } = validFields.data;

  const [existingEmail, existingUser] = await Promise.all([
    prisma.user.count({ where: { email } }),
    prisma.user.findUnique({
      where: { id: license.userId },
      select: { lastEmailChange: true },
    }),
  ]);

  if (existingEmail > 0 || !existingUser) return t("emailTaken");
  if (
    new Date(Date.now()).getTime() -
      new Date(existingUser.lastEmailChange).getTime() <
    config.durations.emailChange
  )
    return t("emailFrequent");

  await Promise.all([
    prisma.user.update({
      where: { id: license.userId },
      data: { email, lastEmailChange: new Date(Date.now()) },
    }),
    redirect("/account"),
  ]);
}

/**
 * ## Terminate Account Action
 * Terminates (deletes) the account of the user (works with license).
 * *Requires React's useActionState() hook.*
 * @returns The new state of the server action (errors or a message).
 */
export async function terminateAccount(): Promise<AuthState> {
  const license = await getLicense();
  if (license?.target !== "terminateaccount") return t("licenseInvalid");

  const existingUser = await prisma.user.count({
    where: { id: license.userId },
  });
  if (existingUser === 0) return t("licenseInvalid");

  await Promise.all([
    prisma.user.delete({ where: { id: license.userId } }),
    deleteSession(),
    deleteLicense(),
    redirect("/account"),
  ]);
}

/**
 * ## Toggle Two-factor authentication (2FA) Action
 * Toggles the users Two-factor authentication (2FA) state.
 * *Doesn't require React's useActionState() hook.*
 */
export async function toggle2fa() {
  const session = await getSession();
  if (!session?.userId) return;

  const existingUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, twoFactorAuth: true },
  });
  if (!existingUser?.id) return;

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { twoFactorAuth: !existingUser.twoFactorAuth },
  });

  revalidatePath("/account");
}
