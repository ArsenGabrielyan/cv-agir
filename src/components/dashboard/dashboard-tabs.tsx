"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAvailableFeatures } from "@/lib/permission"
import { ResumeServerData } from "@/lib/types"
import { CoverLetter, UserPlan } from "@db"
import { useSearchParams } from "next/navigation"
import usePremiumModal from "@/hooks/use-premium-modal"
import dynamic from "next/dynamic"
import DocPageLoader from "../loaders/doc-page"
import { useRouter } from "@/i18n/routing"

interface DashboardContentProps{
     resumes: ResumeServerData[],
     coverLetters: CoverLetter[]
     totalCount: number,
     subscriptionLevel: UserPlan,
     initialValue?: string
}

const ResumeTab = dynamic(()=>import("./tabs/resume"),{
     loading: DocPageLoader,
     ssr: false
})
const CoverLetterTab = dynamic(()=>import("./tabs/cover-letter"),{
     loading: DocPageLoader,
     ssr: false
})

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
                    <ResumeTab resumes={resumes} canCreate={canCreateResume(totalCount)}/>
               </TabsContent>
               <TabsContent value="cover-letter">
                    <CoverLetterTab coverLetters={coverLetters} canCreate={canCreateCoverLetters}/>
               </TabsContent>
          </Tabs>
     )
}