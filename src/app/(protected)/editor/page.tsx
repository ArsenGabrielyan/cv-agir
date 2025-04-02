import PageLayout from "@/components/layout/page-layout";
import { Metadata } from "next";
import ResumeEditor from "./resume-editor";
import { ResumeTemplate } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSubscriptionLevel } from "@/actions/subscription-system";
import { getAvailableFeatures } from "@/lib/permission";
import { getCurrentResumeByUserId, getResumeTemplateById } from "@/data/db/resumes";

export const metadata: Metadata = {
     title: "Ձևավորել Ձեր ռեզյումեն"
}

export default async function ResumeEditorPage({
     searchParams
}: {
     searchParams: Promise<{ resumeId?: string, templateId?: string }>
}){
     const {templateId, resumeId} = await searchParams;
     const user = await currentUser();
     if(!user || !user.id){
          redirect("/auth/login")
     }

     const subscriptionLevel = await getSubscriptionLevel(user.id);
     const {canUseTemplates} = getAvailableFeatures(subscriptionLevel)

     const resumeToEdit = resumeId ? await getCurrentResumeByUserId(user.id,resumeId) : null;

     let template: ResumeTemplate | null = null;
     if (templateId) {
          template = await getResumeTemplateById(templateId);
     } else if (resumeToEdit && resumeToEdit.templateId) {
          template = await getResumeTemplateById(resumeToEdit.templateId);
     }

     if(template?.isPremium && !canUseTemplates){
          redirect("/pricing");
     }

     return (
          <PageLayout resumeEditor>
               <ResumeEditor resumeToEdit={resumeToEdit} template={template}/>
          </PageLayout>
     )
}