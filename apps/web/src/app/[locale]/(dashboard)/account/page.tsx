import { getUser } from "@/auth/dal";
import AccountCustomization from "@/components/blocks/account/customization";
import AccountPersonalization from "@/components/blocks/account/personalization";
import AccountPrivacy from "@/components/blocks/account/privacy";
import config from "@repo/config";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AccountHeader from "./header";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountPage");
  return {
    title: t("title"),
    description: t("description", { brand: config.name }),
  };
}

export default async function AccountPage() {
  const user = await getUser();
  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 items-center justify-center mt-4 px-4 pb-6">
      <AccountHeader />
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 lg:gap-6 w-full justify-center items-center max-w-[1200px] mt-4">
        <AccountPersonalization email={user.email} phone={user.phone} />
        <AccountCustomization />
        <div className="lg:col-span-2">
          <AccountPrivacy twoFactorAuth={user.twoFactorAuth} />
        </div>
      </div>
    </div>
  );
}
