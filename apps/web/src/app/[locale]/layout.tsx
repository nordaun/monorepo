import Providers from "@/components/providers";
import { cn } from "@/components/utils";
import { routing } from "@/i18n/routing";
import config, { Locale } from "@repo/config";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "./globals.css";
import Loading from "./loading";

const poppinsSans = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${config.name}`,
    default: config.name,
  },
  description: `The ${config.name} web application`,
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={cn(
          "antialiased text-foreground bg-background min-h-dvh overflow-hidden",
          poppinsSans.className
        )}
      >
        <Suspense fallback={<Loading />}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
