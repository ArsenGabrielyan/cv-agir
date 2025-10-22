import ContactForm from "@/components/form/contact-form";
import PageLayout from "@/components/layout/page-layout";
import LandingHeroLoader from "@/components/loaders/landing-hero-loader";
import { Button } from "@/components/ui/button";
import {Mail, CircleHelp, MapPin} from "lucide-react"
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
     title: "Հետադարձ կապ"
}

const ContactHero = dynamic(()=>import("@/components/section-hero"),{
     loading: () => <LandingHeroLoader/>
})

export default function ContactPage(){
     return (
          <PageLayout landingFooter>
               <ContactHero title="Հետադարձ կապ"/>
               <section className="py-16 px-6 sm:px-12 md:px-24 lg:px-40">
                    <ContactForm/>
                    <ul className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6 max-w-[1750px] mt-6">
                         <li className="p-4 space-y-2">
                              <div className="w-14 h-14 aspect-square bg-muted p-[10px] rounded-xl mb-[10px]"><Mail className="w-full h-full aspect-square text-muted-foreground"/></div>
                              <h2 className="text-2xl font-semibold">Ուղարկեք մեր էլ․ փոստին</h2>
                              <p className="text-muted-foreground">Ընդհանուր հարցումների և գործընկերության հնարավորությունների համար էլ. փոստով ուղարկեք մեզ:</p>
                              <p className="text-primary font-semibold text-xl">arsen-g@example.com</p>
                         </li>
                         <li className="p-4 space-y-2">
                              <div className="w-14 h-14 aspect-square bg-muted p-[10px] rounded-xl mb-[10px]"><CircleHelp className="w-full h-full aspect-square text-muted-foreground"/></div>
                              <h2 className="text-2xl font-semibold">Աջակցություն</h2>
                              <p className="text-muted-foreground">Ընդհանուր հարցումների և գործընկերության հնարավորությունների համար էլ. փոստով ուղարկեք մեզ:</p>
                              <Button size="lg" asChild>
                                   <Link href="/contact">Հետադարձ կապ</Link>
                              </Button>
                         </li>
                         <li className="p-4 space-y-2">
                              <div className="w-14 h-14 aspect-square bg-muted p-[10px] rounded-xl mb-[10px]"><MapPin className="w-full h-full aspect-square text-muted-foreground"/></div>
                              <h2 className="text-2xl font-semibold">Հասցե</h2>
                              <p className="text-muted-foreground">Երևան, Հայաստան, Փոստային ինդեքս` 0051</p>
                         </li>
                    </ul>
               </section>
          </PageLayout>
     )
}