import PageLayout from "@/components/layout/page-layout";
import Pricing from "@/components/landing-page/pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Առաջարկներ և գներ"
}

export default function PricingPage(){
     return (
          <PageLayout landingFooter>
               <section className="flex justify-center items-center text-center flex-col space-y-6 pt-4 sm:pt-24 px-5 w-full bg-[url(/bg.svg)]">
                    <div className="text-4xl sm:text-5xl md:text-6xl space-y-5 font-bold">
                         <h1>Առաջարկներ և գներ</h1>
                    </div>
                    <Pricing/>
                    <div className="w-full h-24"></div>
               </section>
          </PageLayout>
     )
}