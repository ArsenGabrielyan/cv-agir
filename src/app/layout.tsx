import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeDataProvider from "@/context/theme-data-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { env } from "@/lib/env";

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

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang="hy" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeDataProvider>
              <Toaster/>
              {children}
              <Script
                src={`https://www.google.com/recaptcha/api.js?render=${env.NEXT_PUBLIC_RECAPTCHA_SITE}`}
              />
            </ThemeDataProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
