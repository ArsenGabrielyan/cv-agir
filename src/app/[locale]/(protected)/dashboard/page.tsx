import { getSubscriptionLevel } from "@/actions/subscription-system";
import PageLayout from "@/components/layout/page-layout";
import { resumeDataInclude } from "@/lib/types";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { getResumeCountByUserId } from "@/data/resumes";
import DashboardContent from "@/components/dashboard/dashboard-tabs";
import { getAvailableFeatures } from "@/lib/permission";
import { redirect, routing } from "@/i18n/routing";
import { LocalePageProps } from "@/app/[locale]/layout";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
     title: "Վահանակ"
}

export default async function DashboardPage({searchParams, params}: LocalePageProps & {
     searchParams: Promise<{show: string}>
}){
     const {locale} = await params
     if (!hasLocale(routing.locales, locale)) {
          notFound();
     }
     const user = await currentUser();
     const {show} = await searchParams;
     if(!user || !user.id){
          return null;
     }
     const [resumes, totalCount, subscriptionLevel, coverLetters] = await Promise.all([
          db.resume.findMany({
               where: { userId: user.id },
               orderBy: { updatedAt: "desc" },
               include: resumeDataInclude
          }),
          getResumeCountByUserId(user.id),
          getSubscriptionLevel(user.id),
          db.coverLetter.findMany({
               where: { userId: user.id },
               orderBy: { updatedAt: "desc" },
          })
     ])
     const errMsg = await getTranslations("error-messages")
     const {canCreateCoverLetters} = getAvailableFeatures(subscriptionLevel,errMsg)
     if(show==="cover-letter" && !canCreateCoverLetters){
          redirect({
               href: "/pricing",
               locale
          });
          return
     }
     return (
          <PageLayout sidebarMode>
               <div className="flex justify-between items-center gap-5 my-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3">Վահանակ</h1>
               </div>
               <DashboardContent coverLetters={coverLetters} resumes={resumes} totalCount={totalCount} subscriptionLevel={subscriptionLevel} initialValue={show}/>
          </PageLayout>
     )
}