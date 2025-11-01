import PageLayout from "@/components/layout/page-layout"
import SettingsContent from "@/components/pages/settings"
import { getSubscriptionsByUserId, getIsSubscriptionExpired } from "@/data/subscription"
import { redirect, routing } from "@/i18n/routing"
import { currentUser } from "@/lib/auth"
import { Metadata } from "next"
import { LocalePageProps } from "@/app/[locale]/layout";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server"

export const generateMetadata = async(): Promise<Metadata> => {
     const t = await getTranslations("settings");
     return {
          title: t("title")
     }
}

export default async function SettingsPage({params}: LocalePageProps){
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
     const [subscriptions, isExpired] = await Promise.all([
          getSubscriptionsByUserId(user.id),
          getIsSubscriptionExpired(user.id)
     ])
     return (
          <PageLayout sidebarMode>
               <SettingsContent
                    subscriptions={subscriptions}
                    isExpired={isExpired}
               />
          </PageLayout>
     )
}