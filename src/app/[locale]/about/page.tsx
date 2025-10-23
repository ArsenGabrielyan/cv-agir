import PageLayout from "@/components/layout/page-layout";
import AboutContent from "@/components/pages/about";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Մեր Մասին"
}

export default function AboutPage(){
     return (
          <PageLayout landingFooter>
               <AboutContent/>
          </PageLayout>
     )
}