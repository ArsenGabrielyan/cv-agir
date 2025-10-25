import { getResumeTemplates } from "@/data/resumes";
import PageLayout from "@/components/layout/page-layout";
import { Metadata } from "next";
import { currentUser } from "@/lib/auth";
import { getSubscriptionLevel } from "@/actions/subscription-system";
import { LocalePageProps } from "../layout";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import TemplatesContent from "@/components/pages/templates";

export const metadata: Metadata = {
     title: "Ռեզյումեի շաբլոններ"
}

export default async function TemplatesPage({params}: LocalePageProps){
     const {locale} = await params
     if (!hasLocale(routing.locales, locale)) {
          notFound();
     }
     const user = await currentUser();
     const subscriptionLevel = user?.id ? await getSubscriptionLevel(user?.id) : "free"
     const templates = await getResumeTemplates(locale);
     return (
          <PageLayout landingFooter>
               <TemplatesContent
                    templates={templates}
                    subscriptionLevel={subscriptionLevel}
               />
          </PageLayout>
     )
}