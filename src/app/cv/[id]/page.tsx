import PageLayout from "@/components/layout/page-layout";
import ResumeInfo from "@/components/dashboard/resumes/resume-info";
import { getResumeById } from "@/data/db/resumes";
import { isObjectId } from "@/data/helpers";
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
     const resume = await getResumeById(id);
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