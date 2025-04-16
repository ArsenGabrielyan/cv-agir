import PageLayout from "@/components/layout/page-layout";
import { getResumeById } from "@/data/db/resumes";
import { isObjectId } from "@/data/helpers";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CVInfoLoader from "@/components/loaders/cv-info";
import { cache } from "react";
import dynamic from "next/dynamic";

const getResumeData = cache(async(id: string) => {
     if(!isObjectId(id)){
          notFound();
     }
     const resume = await getResumeById(id);
     if(!resume){
          notFound();
     }
     return resume
})

export const generateMetadata = async({params}: CVPageProps): Promise<Metadata> => {
     const {id} = await params;
     const resume = await getResumeData(id);
     return {
          title: `"${resume.fname} ${resume.lname}"-ի ռեզյումեն`
     }
}

const ResumeInfo = dynamic(()=>import("@/components/dashboard/resumes/resume-info"),{
     loading: CVInfoLoader
})

interface CVPageProps{
     params: Promise<{id: string}>
}
export default async function CVPage({params}: CVPageProps){
     const {id} = await params
     const resume = await getResumeData(id);
     return (
          <PageLayout landingFooter>
               <div className="flex justify-center items-center flex-col">
                    <ResumeInfo data={resume}/>
               </div>
          </PageLayout>
     )
}