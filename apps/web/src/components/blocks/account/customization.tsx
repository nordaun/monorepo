"use client";

import { ColorContext } from "@/components/providers/color";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/components/utils";
import { useLocale } from "@/i18n/locale";
import { usePathname, useRouter } from "@/i18n/navigation";
import config, { Color, Locale } from "@repo/config";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ComponentProps, useContext, useTransition } from "react";

type CustomizableName = "language" | "theme" | "color";
type CustomizableValue = Locale | Color | string;
type Customizable<T extends CustomizableValue = CustomizableValue> = {
  name: CustomizableName;
  current: T | undefined;
  options: readonly T[];
  setter: (value: string) => void;
};

export default function AccountCustomization({
  className,
  ...props
}: ComponentProps<"div">) {
  const t = useTranslations("AccountPage");
  const { theme, themes, setTheme } = useTheme();
  const { color, setColor } = useContext(ColorContext);
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function setLanguage(locale: Locale) {
    startTransition(() => {
      router.replace({ pathname }, { locale });
    });
  }

  const customizables: Customizable[] = [
    {
      name: "language",
      current: useLocale(),
      options: config.locales,
      setter: (value: string) => setLanguage(value as Locale),
    },
    {
      name: "theme",
      current: theme,
      options: themes,
      setter: setTheme,
    },
    {
      name: "color",
      current: color,
      options: config.colors,
      setter: (value: string) => setColor(value as Color),
    },
  ];

  return (
    <Card
      id="customization"
      className={cn(
        "flex w-full h-full justify-center items-center text-center lg:bg-card lg:border border-0 bg-transparent lg:px-[1vw] lg:py-[5vh] p-0 gap-8 shadow-none lg:shadow-sm",
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>{t("customizationTitle")}</CardTitle>
        <CardDescription>
          {t("customizationDescription", { brand: config.name })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full gap-3">
        {customizables.map((customizable) => (
          <ListItem
            key={customizable.name}
            customizable={customizable}
            pending={pending}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ListItem({
  customizable,
  pending,
  className,
  ...props
}: ComponentProps<"div"> & { customizable: Customizable; pending: boolean }) {
  const t = useTranslations("Customizables");

  return (
    <div className={cn("flex flex-col w-full gap-2.5", className)} {...props}>
      <Label>{t(customizable.name)}</Label>
      <Select
        value={customizable.current ?? ""}
        onValueChange={(value) => customizable.setter(value)}
        name={`${customizable.name}Select`}
      >
        <SelectTrigger className="w-full" name={customizable.name}>
          <SelectValue
            placeholder={
              pending ? t("submitting") : t(`${customizable.name}Select`)
            }
          />
        </SelectTrigger>
        <SelectContent>
          {customizable.options.map((option) => (
            <SelectItem key={option} value={option}>
              {t(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
