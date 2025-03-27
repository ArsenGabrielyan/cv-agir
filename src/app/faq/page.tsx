import PageLayout from "@/components/layout/page-layout";
import { FAQ_DATA } from "@/data/constants/landing-page";
import { CircleHelp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Հարցեր և պատասխաններ"
}

export default function FAQPage(){
     return (
          <PageLayout landingFooter>
               <section className="flex justify-center items-center text-center flex-col space-y-6 pt-4 sm:pt-20 w-full bg-[url(/bg.svg)] px-5">
                    <div className="text-4xl sm:text-5xl md:text-6xl space-y-5 font-bold">
                         <h1>Հարցեր և պատասխաններ</h1>
                    </div>
                    <div className="w-full h-20"></div>
               </section>
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