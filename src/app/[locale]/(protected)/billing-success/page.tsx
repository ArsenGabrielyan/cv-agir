import { currentUser } from "@/lib/auth";
import { redirect, routing } from "@/i18n/routing";
import { getSubscriptionLevel } from "@/actions/subscription-system";
import { Metadata } from "next";
import { LocalePageProps } from "@/app/[locale]/layout";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PremiumUpgradeMsg from "@/components/pages/premium-upgrade-msg";

export const generateMetadata = async(): Promise<Metadata> => {
     const t = await getTranslations("premium-msg");
     return {
          title: t("title")
     }
}

export default async function Page({params}: LocalePageProps){
     const {locale} = await params
     if (!hasLocale(routing.locales, locale)) {
         notFound();
     }
     const user = await currentUser();
     if(!user || !user.id){
          redirect({
               href: "/auth/login",
               locale
          });
          return;
     }
     const subscriptionLevel = await getSubscriptionLevel(user.id);
     if(subscriptionLevel!=="premium"){
          redirect({
               href: "/dashboard",
               locale
          })
          return;
     }
     return (
          <PremiumUpgradeMsg/>
     )
}