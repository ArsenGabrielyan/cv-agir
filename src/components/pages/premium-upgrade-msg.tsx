"use client"
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function PremiumUpgradeMsg(){
     const t = useTranslations("premium-msg")
     return (
          <main className="mx-auto max-w-7xl space-y-6 px-3 py-6 text-center">
               <h1 className="text-3xl font-semibold">{t("congrats")}</h1>
               <p className="text-muted-foreground">{t("title")}</p>
               <Button asChild>
                    <Link href="/dashboard">{t("goBack")}</Link>
               </Button>
          </main>
     )
}