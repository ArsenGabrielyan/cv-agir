import type { Metadata, Viewport } from "next";
import "../globals.css";
import { ThemeProvider } from "next-themes";
import ThemeDataProvider from "@/context/theme-data-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/lib/env";
import ReCaptcha from "@/components/recaptcha-script";
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | CV-ագիր",
    absolute: "CV-ագիր - Ստեղծիր CV արագ"
  },
  description: "CV-ագիրը ռեզյումե գեներացնելու հավելված է։",
  authors: {
    url: "https://github.com/ArsenGabrielyan",
    name: "Արսեն Գաբրիելյան"
  },
  applicationName: "CV-ագիր",
  icons: {
    icon: "/app-icon.png",
    apple: "/app-icon.png"
  },
};

export const viewport: Viewport = {
  themeColor: "#002a4f"
}

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export type LocalePageProps = Omit<Props,"children">
 
export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const session = await auth();
  console.log(session)
  return (
    <SessionProvider session={session} basePath="/api/auth">
      <html lang={locale} suppressHydrationWarning>
        <head>
          <link rel="preload" href="/demos/demo-1.webm" as="video" type="video/webm" fetchPriority="high" />
          <link rel="preload" href="/demos/demo-1-thumb.webp" as="image" type="image/webp" fetchPriority="high" />
          <link rel="preload" href="/demos/demo-2.webm" as="video" type="video/webm" fetchPriority="high" />
          <link rel="preload" href="/demos/demo-2-thumb.webp" as="image" type="image/webp" fetchPriority="high" />
          <link rel="preload" href="/demos/demo-3.webm" as="video" type="video/webm" fetchPriority="high" />
          <link rel="preload" href="/demos/demo-3-thumb.webp" as="image" type="image/webp" fetchPriority="high" />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeDataProvider>
              <NextIntlClientProvider>
                <Toaster/>
                {children}
                <ReCaptcha siteKey={env.NEXT_PUBLIC_RECAPTCHA_SITE}/>
              </NextIntlClientProvider>
            </ThemeDataProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
