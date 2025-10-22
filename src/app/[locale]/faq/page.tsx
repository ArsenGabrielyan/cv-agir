import PageLayout from "@/components/layout/page-layout";
import FAQPageContent from "@/components/pages/faq";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Հարցեր և պատասխաններ"
}

export default function FAQPage(){
     return (
          <PageLayout landingFooter>
               <FAQPageContent/> 
          </PageLayout>
     )
}