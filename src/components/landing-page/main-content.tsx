"use client"
import Pricing from "@/components/landing-page/sections/pricing";
import Features from "@/components/landing-page/sections/features";
import AccordionFAQ from "@/components/landing-page/sections/faq-accordion";
import { useCurrentUser } from "@/hooks/use-current-user";
import dynamic from "next/dynamic";
import LandingHeroLoader from "../loaders/landing-hero-loader";
import HowItWorks from "./sections/how-it-works";

const LandingHero = dynamic(()=>import("@/components/landing-page/sections/landing-hero"),{
     ssr: false,
     loading: () => <LandingHeroLoader loaderType="main"/>
})

export default function MainPageContent(){
     const user = useCurrentUser();
     return (
          <>
               <LandingHero user={user}/>
               <HowItWorks/> 
               <Features/>
               <Pricing/>
               <AccordionFAQ/>
          </>
     )
}