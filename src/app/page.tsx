"use client"
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Pricing from "@/components/landing-page/pricing";
import PageLayout from "@/components/layout/page-layout";
import Features from "@/components/landing-page/features";
import AccordionFAQ from "@/components/landing-page/faq-accordion";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Home() {
  const user = useCurrentUser();
  return (
    <PageLayout isLandingPage>
      <section className="flex justify-center items-center text-center flex-col space-y-6 pt-4 sm:pt-32 w-full bg-[url(/bg.svg)]" id="hero">
        <div className="text-4xl sm:text-5xl md:text-6xl space-y-5 font-bold">
          <h1>Ձեր ռեզյումեն՝ վայրկյանների ընթացքում</h1>
        </div>
        <p className="text-sm md:text-xl font-light text-zinc-700 dark:text-zinc-400">Ստեղծեք պրոֆեսիոնալ ռեզյումե արագ և հեշտ, և ներբեռնեք անվճար</p>
        <Link href={!user ? "/auth/register" : "/dashboard"} className={buttonVariants({variant: "default"})}>Սկսել անվճար</Link>
        <p className="text-xs md:text-sm font-normal text-zinc-700 dark:text-zinc-400">Կրեդիտ քարտ չի պահանջվում։</p>
        <div className="w-full bg-gradient-to-b from-transparent to-background h-32"></div>
      </section>
      <section className="flex justify-center items-center flex-col space-y-4 w-full px-3" id="how-it-works">
        <h2 className="text-2xl sm:text-3xl md:text-4xl space-y-5 font-bold">Ինչպե՞ս է աշխատում</h2>
        <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl text-center">
          {/* TODO: Add Demo Images */}
          <li className="flex flex-col items-center justify-start space-y-4 mt-12 pb-24">
            <div className="bg-card p-4 shadow-sm border rounded-xl w-[250px] h-[250px]"></div>
            <p>1. Ընտրել ռեզյումեի շաբլոն հարմար և պրոֆեսիոնալ ռեզյումե պատրաստելու համար։</p>
          </li>
          <li className="flex flex-col items-center justify-start space-y-4 mt-12 pb-24">
          <div className="bg-card p-4 shadow-sm border rounded-xl w-[250px] h-[250px]"></div>
            <p>2. Լրացնել ձեր տվյալները ձեր ռեզյումեի համար։</p>
          </li>
          <li className="flex flex-col items-center justify-start space-y-4 mt-12 pb-24">
            <div className="bg-card p-4 shadow-sm border rounded-xl w-[250px] h-[250px]"></div>
            <p>3. Ստեղծել և ներբեռնել ռեզյումեն որպես PDF ֆայլ։</p>
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
    </PageLayout>
  )
}