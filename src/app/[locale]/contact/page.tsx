import PageLayout from "@/components/layout/page-layout";
import { Metadata } from "next";
import ContactContent from "@/components/pages/contact";

export const metadata: Metadata = {
     title: "Հետադարձ կապ"
}

export default function ContactPage(){
     return (
          <PageLayout landingFooter>
               <ContactContent/>
          </PageLayout>
     )
}