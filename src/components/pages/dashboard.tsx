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
import { useTranslations } from "next-intl"

const ResumeTab = dynamic(()=>import("@/components/dashboard/tabs/resume"),{
     loading: DocPageLoader,
     ssr: false
})
const CoverLetterTab = dynamic(()=>import("@/components/dashboard/tabs/cover-letter"),{
     loading: DocPageLoader,
     ssr: false
})

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
     const errMsg = useTranslations("error-messages")
     const {canCreateResume, canCreateCoverLetters} = getAvailableFeatures(subscriptionLevel,errMsg);
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
     const t = useTranslations("dashboard")
     return (
          <>
               <div className="flex justify-between items-center gap-5 my-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3">{t("title")}</h1>
               </div>
               <Tabs defaultValue={show} onValueChange={onChangeTabs}>
                    <TabsList className="w-full">
                         <TabsTrigger value="resume" className="flex-1">{t("resumes.title")}</TabsTrigger>
                         <TabsTrigger value="cover-letter" className="flex-1">{t("cover-letters.title")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="resume">
                         <ResumeTab resumes={resumes} canCreate={canCreateResume(totalCount)} t={t}/>
                    </TabsContent>
                    <TabsContent value="cover-letter">
                         <CoverLetterTab coverLetters={coverLetters} canCreate={canCreateCoverLetters} t={t}/>
                    </TabsContent>
               </Tabs>
          </>
     )
}