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
                    <div className="space-y-5">
                         <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">Առաջարկներ և գներ</h1>
                    </div>
                    <Pricing/>
                    <div className="w-full h-24"></div>
               </section>
          </PageLayout>
     )
}