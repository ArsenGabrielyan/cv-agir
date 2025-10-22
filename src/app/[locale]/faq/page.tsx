import PageLayout from "@/components/layout/page-layout";
import LandingHeroLoader from "@/components/loaders/landing-hero-loader";
import { FAQ_DATA } from "@/lib/constants/landing-page";
import { CircleHelp } from "lucide-react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
     title: "Հարցեր և պատասխաններ"
}

const FAQHero = dynamic(()=>import("@/components/landing-page/sections/landing-hero"),{
     loading: () => <LandingHeroLoader/>
})

export default function FAQPage(){
     return (
          <PageLayout landingFooter>
               <FAQHero heroTitle="Հարցեր և պատասխաններ"/>
               <section className="py-16 px-6 sm:px-12 md:px-24 lg:px-40 flex items-center justify-center">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mt-4">
                         {FAQ_DATA.map(({id,question,answer})=>(
                              <li key={id}>
                                   <h2 className="text-xl flex gap-x-2 font-semibold items-center"><CircleHelp className="text-primary w-6 h-6"/> {question}</h2>
                                   <p>{answer}</p>
                              </li>
                         ))}
                    </ul>
               </section>
          </PageLayout>
     )
}