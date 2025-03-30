import PageLayout from "@/components/layout/page-layout";
import ResumeCard from "@/components/resume-card";
import { Button } from "@/components/ui/button";
import { resumeDataInclude } from "@/data/types";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
     title: "Վահանակ"
}

export default async function DashboardPage(){
     const user = await currentUser();
     if(!user || !user.id){
          return null;
     }

     const [resumes, totalCount] = await Promise.all([
          db.resume.findMany({
               where: { userId: user.id },
               orderBy: { updatedAt: "desc" },
               include: resumeDataInclude
          }),
          db.resume.count({
               where: {
                    userId: user.id
               }
          })
     ])

     // TODO: Check Quota for Free Users
     return (
          <PageLayout sidebarMode>
               <div className="flex justify-between items-center gap-5 my-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3">Վահանակ</h1>
                    <Button asChild>
                         <Link href="/editor"><PlusCircle/> Ստեղծել Ռեզյումե</Link>
                    </Button>
               </div>
               <div className="space-y-1">
                    <h2>Ձեր ռեզյումեները</h2>
                    <p>Ընդհանուր՝ {totalCount}</p>
               </div>
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