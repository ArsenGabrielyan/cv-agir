import PageLayout from "@/components/layout/page-layout";
import ResumeInfo from "@/components/resume-info";
import { isObjectId } from "@/data/helpers/other";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function CVPage({
     params
}: {
     params: Promise<{id: string}>
}){
     const {id} = await params
     if(!isObjectId(id)){
          notFound();
     }
     const resume = await db.resume.findUnique({ where: { id } })
     if(!resume){
          notFound()
     }
     return (
          <PageLayout landingFooter>
               <div className="flex justify-center items-center flex-col">
                    <ResumeInfo data={resume}/>
               </div>
          </PageLayout>
     )
}