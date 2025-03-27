import PageLayout from "@/components/layout/page-layout";
import { Metadata } from "next";
import ResumeEditor from "@/app/(protected)/editor/resume-editor";
import { db } from "@/lib/db";
import { ResumeTemplate } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

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

     const resumeToEdit = resumeId ? await db.resume.findUnique({
          where: {
               id: resumeId,
               userId: user.id
          },
     }) : null

     let template: ResumeTemplate | null = null;
     if (templateId) {
          template = await db.resumeTemplate.findUnique({
               where: { id: templateId },
          });
     } else if (resumeToEdit && resumeToEdit.templateId) {
          template = await db.resumeTemplate.findUnique({
               where: { id: resumeToEdit.templateId },
          });
     }

     return (
          <PageLayout resumeEditor>
               <ResumeEditor resumeToEdit={resumeToEdit} template={template}/>
          </PageLayout>
     )
}