"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAvailableFeatures } from "@/lib/permission"
import ResumeCard from "./resumes/resume-card"
import {CreateCoverLetterButton, CreateResumeButton} from "./create-buttons"
import { ResumeServerData } from "@/data/types"
import { CoverLetter, UserPlan } from "@prisma/client"
import { useRouter, useSearchParams } from "next/navigation"
import usePremiumModal from "@/hooks/use-premium-modal"
import CoverLetterCard from "./cover-letters/cl-card"

interface DashboardContentProps{
     resumes: ResumeServerData[],
     coverLetters: CoverLetter[]
     totalCount: number,
     subscriptionLevel: UserPlan,
     initialValue?: string
}
export default function DashboardContent({resumes, totalCount, subscriptionLevel, initialValue="resume", coverLetters}: DashboardContentProps){
     const searchParams = useSearchParams();
     const show = searchParams.get("show") || initialValue;
     const router = useRouter();
     const {canCreateResume, canCreateCoverLetters} = getAvailableFeatures(subscriptionLevel);
     const premiumModal = usePremiumModal();
     const onChangeTabs = (tab: string) => {
          if(tab==="cover-letter" && !canCreateCoverLetters){
               premiumModal.setOpen(true);
               return;
          } else {
               const newSearchParams = new URLSearchParams(searchParams);
               newSearchParams.set("show",tab)
               router.push(`?${newSearchParams.toString()}`)
          }
     }
     return (
          <Tabs defaultValue={show} onValueChange={onChangeTabs}>
               <TabsList className="w-full">
                    <TabsTrigger value="resume" className="flex-1">Ռեզյումեներ</TabsTrigger>
                    <TabsTrigger value="cover-letter" className="flex-1">Ուղեկցող նամակներ</TabsTrigger>
               </TabsList>
               <TabsContent value="resume">
                    <div className="flex justify-between items-center gap-2 my-4 flex-wrap">
                         <h2 className="text-xl flex-1 sm:flex-none md:text-2xl lg:text-3xl font-semibold mb-3">Ռեզյումեներ</h2>
                         <CreateResumeButton className="flex-1 sm:flex-none" canCreate={canCreateResume(totalCount)}/>
                    </div>
                    <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-3">
                         {resumes.map(resume=>(
                              <ResumeCard
                                   key={resume.id}
                                   data={resume}
                              />
                         ))}
                    </div>
               </TabsContent>
               <TabsContent value="cover-letter">
                    <div className="flex justify-between items-center gap-2 my-4 flex-wrap">
                         <h2 className="text-xl flex-1 sm:flex-none md:text-2xl lg:text-3xl font-semibold mb-3">Ուղեկցող նամակներ</h2>
                         <CreateCoverLetterButton className="flex-1 sm:flex-none" canCreate={canCreateCoverLetters}/>
                         <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-3">
                              {coverLetters.map(letter=>(
                                   <CoverLetterCard
                                        key={letter.id}
                                        data={letter}
                                   />
                              ))}
                         </div>
                    </div>
               </TabsContent>
          </Tabs>
     )
}