import PageLayout from "@/components/layout/page-layout";
import { Metadata } from "next";
import ResumeEditor from "@/app/(protected)/editor/resume-editor";
import { db } from "@/lib/db";
import { ResumeTemplate } from "@prisma/client";

export const metadata: Metadata = {
     title: "Ձևավորել ձեր ռեզյումեն | CV-ագիր"
}

export default async function ResumeEditorPage({
     searchParams
}: {
     searchParams: Promise<{ resumeId?: string, templateId?: string }>
}){
     const {templateId, resumeId} = await searchParams;

     const template: ResumeTemplate | null = templateId ? await db.resumeTemplate.findUnique({
          where: {
               id: templateId
          }
     }) : null

     return (
          <PageLayout resumeEditor>
               <ResumeEditor template={template}/>
          </PageLayout>
     )
}