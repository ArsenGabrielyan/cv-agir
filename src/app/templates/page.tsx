import { getResumeTemplates } from "@/data/db/resumes";
import PageLayout from "@/components/layout/page-layout";
import TemplateList from "@/components/templates/template-list";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Ռեզյումեի շաբլոններ"
}

export default async function TemplatesPage(){
     const templates = await getResumeTemplates();
     return (
          <TooltipProvider>
               <PageLayout landingFooter>
                    <section className="flex justify-center items-center text-center flex-col space-y-6 pt-4 sm:pt-20 w-full bg-[url(/bg.svg)]">
                         <div className="text-4xl sm:text-5xl md:text-6xl space-y-5 font-bold">
                              <h1>Շաբլոններ</h1>
                              <p className="text-sm md:text-xl font-light text-zinc-700 dark:text-zinc-400">Նայեք բոլոր ռեզյումեների շաբլոնները այստեղ և ճիշտ օգտագործեք աշխատանքի ընդունելու համար։</p>
                         </div>
                         <div className="w-full h-20"></div>
                    </section>
                    <TemplateList templates={templates} />
               </PageLayout>
          </TooltipProvider>
     )
}