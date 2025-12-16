"use client";

import { logout, toggle2fa } from "@/auth/actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/components/utils";
import { Link } from "@/i18n/navigation";
import config from "@repo/config";
import { useTranslations } from "next-intl";
import { ComponentProps } from "react";

export type PrivacyItem = {
  name: string;
  action: string | (() => Promise<void>);
  buttonStyle: "destructive" | "secondary";
};

const privacyItems: PrivacyItem[] = [
  {
    name: "migrateEmail",
    action: "/verify?target=migrateemail",
    buttonStyle: "secondary",
  },
  {
    name: "resetPassword",
    action: "/verify?target=resetpassword",
    buttonStyle: "secondary",
  },
  {
    name: "logout",
    action: logout,
    buttonStyle: "destructive",
  },
  {
    name: "terminateAccount",
    action: "/verify?target=terminateaccount",
    buttonStyle: "destructive",
  },
];

export default function AccountPrivacy({
  className,
  twoFactorAuth,
  ...props
}: { twoFactorAuth: boolean } & ComponentProps<"div">) {
  const t = useTranslations("AccountPage");
  return (
    <Card
      id="privacy"
      className={cn(
        "flex max-w-[1200px] w-full h-full justify-center items-center text-center lg:bg-card lg:border border-0 bg-transparent lg:px-[1vw] lg:py-[5vh] p-0 gap-8 shadow-none lg:shadow-sm",
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>{t("privacyTitle")}</CardTitle>
        <CardDescription>
          {t("privacyDescription", { brand: config.name })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full lg:gap-3">
        <div className="flex lg:flex-row flex-col items-center justify-center w-full h-full lg:gap-6">
          <ListAccordion itemName="twoFactorAuth" />
          <div className="flex flex-col flex-1 gap-1 h-full w-full">
            <Button
              variant={"secondary"}
              className="w-full"
              onClick={() => toggle2fa()}
            >
              {twoFactorAuth
                ? t("twoFactorAuthDisableButton")
                : t("twoFactorAuthEnableButton")}
            </Button>
          </div>
        </div>
        {privacyItems.map((item) => (
          <ListItem item={item} key={item.name} />
        ))}
      </CardContent>
    </Card>
  );
}

function ListItem({
  item,
  className,
  ...props
}: { item: PrivacyItem } & ComponentProps<"div">) {
  const t = useTranslations("AccountPage");
  return (
    <div
      className={cn(
        "flex lg:flex-row flex-col items-center justify-center w-full h-full lg:gap-6",
        className
      )}
      {...props}
    >
      <ListAccordion itemName={item.name} />
      <div className="flex flex-col flex-1 h-full w-full">
        {typeof item.action === "function" ? (
          <Button
            variant={item.buttonStyle}
            className="w-full"
            onClick={() => (item.action as () => Promise<void>)()}
          >
            {t(`${item.name}Button`)}
          </Button>
        ) : (
          <Link href={item.action}>
            <Button variant={item.buttonStyle} className="w-full">
              {t(`${item.name}Button`)}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function ListAccordion({ itemName }: { itemName: string }) {
  const t = useTranslations("AccountPage");
  return (
    <Accordion className="w-full xl:flex-4 flex-2" defaultValue={[itemName]}>
      <AccordionItem value={itemName}>
        <AccordionTrigger className="text-md">
          {t(`${itemName}Title`)}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-start font-light">
          <p className="text-justify lg:mr-8">
            {t(`${itemName}Description`, {
              cooldown: config.durations.emailChange / (1000 * 60 * 60 * 24),
            })}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
