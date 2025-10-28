import PageLayout from "@/components/layout/page-layout";
import { Metadata } from "next";
import { ResumeTemplate } from "@db";
import { currentUser } from "@/lib/auth";
import { getSubscriptionLevel } from "@/actions/subscription-system";
import { getAvailableFeatures } from "@/lib/permission";
import { getCurrentResumeByUserId, getResumeTemplateById } from "@/data/resumes";
import dynamic from "next/dynamic";
import DocEditorLoader from "@/components/loaders/doc-editor";
import { LocalePageProps } from "@/app/[locale]/layout";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { redirect, routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
     title: "Ձևավորել Ձեր ռեզյումեն"
}
const ResumeEditor = dynamic(()=>import("./resume-editor"),{
     loading: DocEditorLoader
})
export default async function ResumeEditorPage({searchParams, params}: LocalePageProps & {
     searchParams: Promise<{ resumeId?: string, templateId?: string }>
}){
     const {locale} = await params
     if (!hasLocale(routing.locales, locale)) {
          notFound();
     }
     const {templateId, resumeId} = await searchParams;
     const user = await currentUser();
     if(!user || !user.id){
          redirect({
               href: "/auth/login",
               locale
          });
          return;
     }

     const subscriptionLevel = await getSubscriptionLevel(user.id);
     const errMsg = await getTranslations("error-messages")
     const {canUseTemplates} = getAvailableFeatures(subscriptionLevel,errMsg)

     const resumeToEdit = resumeId ? await getCurrentResumeByUserId(user.id,resumeId) : null;

     let template: ResumeTemplate | null = null;
     if (templateId) {
          template = await getResumeTemplateById(templateId);
     } else if (resumeToEdit && resumeToEdit.templateId) {
          template = await getResumeTemplateById(resumeToEdit.templateId);
     }

     if(template?.isPremium && !canUseTemplates){
          redirect({
               href: "/pricing",
               locale
          });
          return
     }

     return (
          <PageLayout editorPage>
               <ResumeEditor resumeToEdit={resumeToEdit} template={template} resumeId={resumeId} userData={user}/>
          </PageLayout>
     )
}