"use client"
import { ResumeServerData } from "@/data/types"
import { CreateResumeButton } from "../create-buttons"
import ResumeCard from "../resumes/resume-card"

interface ResumeTabProps{
     canCreate: boolean,
     resumes: ResumeServerData[]
}
export default function ResumeTab({canCreate,resumes}: ResumeTabProps){
     return (
          <>
               <div className="flex justify-between items-center gap-2 my-4 flex-wrap">
                    <h2 className="text-xl flex-1 sm:flex-none md:text-2xl lg:text-3xl font-semibold mb-3">Ռեզյումեներ</h2>
                    <CreateResumeButton className="flex-1 sm:flex-none" canCreate={canCreate}/>
               </div>
               <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-3">
                    {resumes.map(resume=>(
                         <ResumeCard
                              key={resume.id}
                              data={resume}
                         />
                    ))}
               </div>
          </>
     )
}