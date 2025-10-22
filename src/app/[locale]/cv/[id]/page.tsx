import PageLayout from "@/components/layout/page-layout";
import { getResumeById } from "@/data/resumes";
import { isObjectId } from "@/lib/helpers";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CVInfoLoader from "@/components/loaders/cv-info";
import { cache } from "react";
import dynamic from "next/dynamic";
import { getUserById } from "@/data/user";
import { logAction } from "@/data/logs";
import { getIpAddress } from "@/actions/ip";

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
     const user = resume.userId ? await getUserById(resume.userId) : null
     if(!user || !user.id) notFound();
     await logAction({
          userId: user.id,
          action: "CV_PAGE_VIEWED",
          metadata: {
               resumeId: resume.id,
               viewerIp: await getIpAddress()
          }
     })
     return (
          <PageLayout landingFooter>
               <div className="flex justify-center items-center flex-col">
                    <ResumeInfo data={resume} settings={user.cvPageSettings || {
                         showEmail: true,
                         showAddress: true,
                         showPhone: true,
                         showLinks: true
                    }}/>
               </div>
          </PageLayout>
     )
}