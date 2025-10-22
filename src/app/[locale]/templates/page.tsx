import { getResumeTemplates } from "@/data/resumes";
import PageLayout from "@/components/layout/page-layout";
import TemplateList from "@/components/templates/template-list";
import { Metadata } from "next";
import { currentUser } from "@/lib/auth";
import { getSubscriptionLevel } from "@/actions/subscription-system";
import dynamic from "next/dynamic";
import LandingHeroLoader from "@/components/loaders/landing-hero-loader";

export const metadata: Metadata = {
     title: "Ռեզյումեի շաբլոններ"
}

const TemplateHero = dynamic(()=>import("@/components/section-hero"),{
     loading: () => <LandingHeroLoader loaderType="template"/>
})

export default async function TemplatesPage(){
     const user = await currentUser();
     const subscriptionLevel = user?.id ? await getSubscriptionLevel(user?.id) : "free"
     const templates = await getResumeTemplates();
     return (
          <PageLayout landingFooter>
               <TemplateHero title="Շաբլոններ">
                    <p className="text-sm md:text-xl font-light text-muted-foreground">Նայեք բոլոր ռեզյումեների շաբլոնները այստեղ և ճիշտ օգտագործեք աշխատանքի ընդունելու համար։</p>
               </TemplateHero>
               <TemplateList templates={templates} subscriptionLevel={subscriptionLevel}/>
          </PageLayout>
     )
}