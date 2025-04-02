import { getSubscriptionLevel } from "@/actions/subscription-system";
import PageLayout from "@/components/layout/page-layout";
import CreateResumeButton from "@/components/resumes/create-resume-button";
import ResumeCard from "@/components/resumes/resume-card";
import { resumeDataInclude } from "../../../data/types";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAvailableFeatures } from "@/lib/permission";
import { Metadata } from "next";
import { getResumeCountByUserId } from "@/data/db/resumes";

export const metadata: Metadata = {
     title: "Վահանակ"
}

export default async function DashboardPage(){
     const user = await currentUser();
     if(!user || !user.id){
          return null;
     }

     const [resumes, totalCount, level] = await Promise.all([
          db.resume.findMany({
               where: { userId: user.id },
               orderBy: { updatedAt: "desc" },
               include: resumeDataInclude
          }),
          getResumeCountByUserId(user.id),
          getSubscriptionLevel(user.id)
     ])

     const {canCreateResume} = getAvailableFeatures(level)
     return (
          <PageLayout sidebarMode>
               <div className="flex justify-between items-center gap-5 my-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3">Վահանակ</h1>
                    <CreateResumeButton canCreate={canCreateResume(totalCount)}/>
               </div>
               {/* TODO: Make a Tab, Where I Manage Both Resumes and Cover Letters */}
               <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-3">
                    {resumes.map(resume=>(
                         <ResumeCard
                              key={resume.id}
                              data={resume}
                         />
                    ))}
               </div>
          </PageLayout>
     )
}