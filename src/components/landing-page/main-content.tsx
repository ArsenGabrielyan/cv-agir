"use client"
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Pricing from "@/components/landing-page/pricing";
import Features from "@/components/landing-page/features";
import AccordionFAQ from "@/components/landing-page/faq-accordion";
import { useCurrentUser } from "@/hooks/use-current-user";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainPageContent(){
     const isMobile = useIsMobile();
     const user = useCurrentUser();
     const demoImgSize = isMobile ? 270 : 350;
     return (
          <>
               <section className="flex justify-center items-center text-center flex-col space-y-6 pt-4 sm:pt-32 w-full bg-[url(/bg.svg)]" id="hero">
                    <div className="text-4xl sm:text-5xl md:text-6xl space-y-5 font-bold">
                         <h1>Ձեր ռեզյումեն՝ վայրկյանների ընթացքում</h1>
                    </div>
                    <p className="text-sm md:text-xl font-light text-muted-foreground">Ստեղծեք պրոֆեսիոնալ ռեզյումե արագ և հեշտ, և ներբեռնեք անվճար</p>
                    <Link href={!user ? "/auth/register" : "/dashboard"} className={buttonVariants({variant: "default"})}>Սկսել անվճար</Link>
                    <p className="text-xs md:text-sm font-normal text-muted-foreground">Վարկային քարտ չի պահանջվում։</p>
                    <div className="w-full bg-linear-to-b from-transparent to-background h-32"></div>
               </section>
               <section className="flex justify-center items-center flex-col space-y-4 w-full px-3" id="how-it-works">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl space-y-5 font-bold">Ինչպե՞ս է աշխատում</h2>
                    <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl text-center">
                         <li className="flex flex-col items-center justify-start space-y-4 mt-12 pb-24">
                              <Image
                              src="/demos/demo-1.gif"
                              alt="select template"
                              width={demoImgSize}
                              height={demoImgSize}
                              className="bg-card p-4 shadow-sm border rounded-xl"
                              unoptimized
                              />
                              <p>1. Ընտրել ռեզյումեի շաբլոն հարմար և պրոֆեսիոնալ ռեզյումե պատրաստելու համար։</p>
                         </li>
                         <li className="flex flex-col items-center justify-start space-y-4 mt-12 pb-24">
                              <Image
                              src="/demos/demo-2.gif"
                              alt="fill data"
                              width={demoImgSize}
                              height={demoImgSize}
                              className="bg-card p-4 shadow-sm border rounded-xl"
                              unoptimized
                              />
                              <p>2. Լրացնել Ձեր տվյալները Ձեր ռեզյումեի համար։</p>
                         </li>
                         <li className="flex flex-col items-center justify-start space-y-4 mt-12 pb-24">
                              <Image
                              src="/demos/demo-3.gif"
                              alt="print (download) resume"
                              width={demoImgSize}
                              height={demoImgSize}
                              className="bg-card p-4 shadow-sm border rounded-xl"
                              unoptimized
                              />
                              <p>3. Ներբեռնել ռեզյումեն որպես PDF ֆայլ կամ տպել այն։</p>
                         </li>
                    </ul>
               </section>
               <section className="flex justify-center items-center flex-col space-y-4 w-full px-3 pb-5" id="features">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl space-y-5 font-bold">Հնարավորություններ</h2>
                    <Features/>
               </section>
               <section className="flex justify-center items-center flex-col space-y-4 w-full px-3" id="pricing">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl space-y-5 font-bold">Առաջարկներ և գներ</h2>
                    <Pricing/>
               </section>
               <section className="flex justify-center items-center flex-col space-y-4 w-full px-3" id="faq">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl space-y-5 font-bold">Հաճախակի տրվող հարցեր</h2>
                    <AccordionFAQ/>
               </section>
          </>
     )
}