"use client"
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import Pricing from "@/components/landing-page/pricing";
import Features from "@/components/landing-page/features";
import AccordionFAQ from "@/components/landing-page/faq-accordion";
import { useCurrentUser } from "@/hooks/use-current-user";
import dynamic from "next/dynamic";
import DemoVideoLoader from "../loaders/video-loader";
import LandingHeroLoader from "../loaders/landing-hero-loader";
import { useTranslations } from "next-intl";

const DemoVideo = dynamic(()=>import("@/components/landing-page/demo-video"),{
     loading: () => <DemoVideoLoader/>
})
const LandingHero = dynamic(()=>import("@/components/landing-page/landing-hero"),{
     ssr: false,
     loading: () => <LandingHeroLoader loaderType="main"/>
})

export default function MainPageContent(){
     const user = useCurrentUser();
     const t = useTranslations("index");
     return (
          <>
               <LandingHero heroTitle="Ձեր ռեզյումեն՝ վայրկյանների ընթացքում">
                    <p className="text-sm md:text-xl font-light text-muted-foreground">Ստեղծեք պրոֆեսիոնալ ռեզյումե արագ և հեշտ, և ներբեռնեք անվճար</p>
                    <Link href={!user ? "/auth/register" : "/dashboard"} className={buttonVariants({variant: "default"})}>Սկսել անվճար</Link>
                    <p className="text-xs md:text-sm font-normal text-muted-foreground">Վարկային քարտ չի պահանջվում։</p>
               </LandingHero>
               {t("title")}
               <section className="flex justify-center items-center flex-col space-y-4 w-full px-3" id="how-it-works">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl space-y-5 font-bold">Ինչպե՞ս է աշխատում</h2>
                    <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl text-center">
                         <li className="flex flex-col items-center justify-start space-y-4 mt-12 pb-24">
                              <DemoVideo
                                   src="/demos/demo-1.webm"
                                   srcFallback="/demos/demo-1.mp4"
                                   alt="select template"
                                   thumbnail="/demos/demo-1-thumb.webp"
                                   className="bg-card p-4 shadow-sm border rounded-xl"
                              />
                              <p>1. Ընտրել ռեզյումեի շաբլոն հարմար և պրոֆեսիոնալ ռեզյումե պատրաստելու համար։</p>
                         </li>
                         <li className="flex flex-col items-center justify-start space-y-4 mt-12 pb-24">
                              <DemoVideo
                                   src="/demos/demo-2.webm"
                                   srcFallback="/demos/demo-2.mp4"
                                   alt="fill data"
                                   thumbnail="/demos/demo-2-thumb.webp"
                                   className="bg-card p-4 shadow-sm border rounded-xl"
                              />
                              <p>2. Լրացնել Ձեր տվյալները Ձեր ռեզյումեի համար։</p>
                         </li>
                         <li className="flex flex-col items-center justify-start space-y-4 mt-12 pb-24">
                              <DemoVideo
                                   src="/demos/demo-3.webm"
                                   srcFallback="/demos/demo-3.mp4"
                                   alt="print (download) resume"
                                   thumbnail="/demos/demo-3-thumb.webp"
                                   className="bg-card p-4 shadow-sm border rounded-xl"
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