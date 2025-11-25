import config from "@repo/config";
import { User } from "@repo/database";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import * as z from "zod/v4-mini";

const nameModel = z.string().check(
  z.minLength(5, { error: "nameShort" }),
  z.maxLength(100, { error: "nameLong" }),
  z.regex(/([\p{Lu}][\p{Ll}]+(?:\s[\p{Lu}][\p{Ll}]+)+)/u, {
    error: "nameInvalid",
  }),
  z.trim()
);

const emailModel = z
  .string()
  .check(z.email({ error: "emailInvalid" }), z.trim());

const phoneModel = z.string().check(
  z.refine(
    (phone) => {
      try {
        const parsed = parsePhoneNumberFromString(phone);
        if (!parsed) return false;
        return isValidPhoneNumber(parsed.number);
      } catch {
        return false;
      }
    },
    { message: "phoneInvalid" }
  )
);

const usernameModel = z.string().check(
  z.minLength(3, { error: "usernameShort" }),
  z.maxLength(30, { error: "usernameLong" }),
  z.regex(/^[a-z\d_]+$/, {
    error: "usernameInvalid",
  }),
  z.trim()
);

const passwordModel = z
  .string()
  .check(
    z.minLength(8, { error: "passwordShort" }),
    z.maxLength(50, { error: "passwordLong" }),
    z.regex(/[a-zA-Z]/, { error: "passwordLetter" }),
    z.regex(/[0-9]/, { error: "passwordDigit" }),
    z.trim()
  );

const otpModel = z
  .string()
  .check(z.length(config.lengths.otp, { error: "otpLength" }));

const LoginSchema = z.object({
  email: emailModel,
  password: passwordModel,
});

const SignupSchema = z.object({
  name: nameModel,
  email: emailModel,
  username: usernameModel,
  password: passwordModel,
});

const NameSchema = z.object({
  name: nameModel,
});

const EmailSchema = z.object({
  email: emailModel,
});

const UsernameSchema = z.object({
  username: usernameModel,
});

const PhoneSchema = z.object({
  phone: phoneModel,
});

const PasswordSchema = z.object({
  password: passwordModel,
});

const OtpSchema = z.object({
  otp: otpModel,
});

type Profile = Pick<User, "id" | "name" | "username" | "avatarUrl">;

type AuthState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        phone?: string[];
        username?: string[];
        password?: string[];
        otp?: string[];
      };
      message?: string;
    }
  | undefined;

type Personalizable = keyof typeof Personalizables;

type PersonalizableValue = {
  name: keyof User;
  schema: z.ZodMiniObject<
    {
      [key: string]: z.ZodMiniString<string>;
    },
    z.core.$strip
  >;
};

const Personalizables = {
  name: {
    name: "name",
    schema: NameSchema,
  },
  phone: {
    name: "phone",
    schema: PhoneSchema,
  },
  username: {
    name: "username",
    schema: UsernameSchema,
  },
} as const satisfies Record<string, PersonalizableValue>;

type LicensedRoute = keyof typeof LicensedRoutes;

type LicensedRouteType = {
  name: string;
  href: string;
  hidden: boolean;
};

const LicensedRoutes = {
  resetpassword: {
    name: "resetPassword",
    href: "/resetpassword",
    hidden: false,
  },
  terminateaccount: {
    name: "terminateAccount",
    href: "/terminateaccount",
    hidden: false,
  },
  twofactorauth: {
    name: "twoFactorAuth",
    href: "/account",
    hidden: true,
  },
  migrateemail: {
    name: "migrateEmail",
    href: "/migrateemail",
    hidden: false,
  },
} as const satisfies Record<string, LicensedRouteType>;

type SessionPayload = {
  token: string;
  userId: string;
  expiresAt: Date;
};

type LicensePayload = {
  token: string;
  userId: string;
  signed: boolean;
  target: LicensedRoute;
  expiresAt: Date;
};

type CookiePayload = Pick<
  ResponseCookie,
  "httpOnly" | "secure" | "sameSite" | "path" | "expires"
>;

type MailParams = {
  name: string;
  email: string;
  otp: string;
  route: LicensedRoute;
};

export {
  EmailSchema,
  LicensedRoutes,
  LoginSchema,
  NameSchema,
  OtpSchema,
  PasswordSchema,
  Personalizables,
  PhoneSchema,
  SignupSchema,
  UsernameSchema,
  type AuthState,
  type CookiePayload,
  type LicensedRoute,
  type LicensePayload,
  type MailParams,
  type Personalizable,
  type Profile,
  type SessionPayload,
  type User,
};
