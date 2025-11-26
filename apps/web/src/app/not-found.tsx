import ThemeProvider from "@/components/providers/theme";
import { cn } from "@/components/utils";
import { useTranslations } from "next-intl";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppinsSans = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function NotFound() {
  const t = useTranslations("Errors");
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div
        className={cn(
          "antialiased text-foreground bg-background min-h-dvh overflow-hidden flex flex-row items-center justify-center text-center gap-4",
          poppinsSans.className
        )}
      >
        <h3>404</h3>
        <div className="border border-border h-10" />
        <span>{t("notFound")}</span>
      </div>
    </ThemeProvider>
  );
}
