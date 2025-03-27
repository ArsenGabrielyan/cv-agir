import PageLayout from "@/components/layout/page-layout";
import { CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Մեր Մասին"
}

export default function AboutPage(){
     return (
          <PageLayout landingFooter>
               <section className="flex justify-center items-center text-center flex-col space-y-6 pt-4 sm:pt-20 w-full bg-[url(/bg.svg)]">
                    <div className="text-4xl sm:text-5xl md:text-6xl space-y-5 font-bold">
                         <h1>Մեր Մասին</h1>
                    </div>
                    <div className="w-full h-20"></div>
               </section>
               <section className="py-16 px-6 sm:px-12 md:px-24 lg:px-40 text-center">
                    <h2 className="text-3xl font-bold mb-6">CV-ագիր՝ Ձեր ապագան կերտող ռեզյումե գեներատոր</h2>
                    <p className="text-lg leading-relaxed"><strong>CV-ագիր</strong> ռեզյումե գեներատորը ստեղծվել է, որպեսզի ցանկացած մարդ կարողանա <strong>արագ, արդյունավետ և պրոֆեսիոնալ</strong> ռեզյումե պատրաստել։ Մենք հասկանում ենք, թե որքան կարևոր է ճիշտ ներկայացնել Ձեր հմտությունները և փորձը, ուստի մեր պլատֆորմը ստեղծվել է հենց այս նպատակով։</p>
               </section>
               <section className="bg-card py-16 px-6 sm:px-12 md:px-24 lg:px-40 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ինչու՞ ընտրել CV-ագիր-ը։</h2>
                    <ul className="space-y-4 text-lg text-card-foreground text-left max-w-3xl mx-auto">
                         <li className="flex gap-x-2"><CheckCircle className="text-primary"/><p><strong>Անվճար տարբերակ</strong>՝ ստեղծեք մինչև 3 ռեզյումե առանց որևէ վճարի։</p></li>
                         <li className="flex gap-x-2"><CheckCircle className="text-primary"/><p><strong>Պրոֆեսիոնալ շաբլոններ</strong>՝ ընտրեք տարբեր դիզայններից։</p></li>
                         <li className="flex gap-x-2"><CheckCircle className="text-primary"/><p><strong>AI առաջարկներ</strong>՝ ստացեք օպտիմալացված հմտություններ և տեքստեր։</p></li>
                         <li className="flex gap-x-2"><CheckCircle className="text-primary"/><p><strong>PDF և Word ներբեռնում</strong>՝ Ձեր ռեզյումեն պատրաստ է ցանկացած աշխատանքի դիմումի համար։</p></li>
                         <li className="flex gap-x-2"><CheckCircle className="text-primary"/><p><strong>QR կոդով ռեզյումե</strong>՝ հեշտությամբ կիսվեք Ձեր ռեզյումեով։</p></li>
                    </ul>
               </section>
               <section className="py-16 px-6 sm:px-12 md:px-24 lg:px-40 text-center">
                    <h2 className="text-3xl font-bold mb-6">Մեր Առաքելությունը</h2>
                    <p className="text-lg leading-relaxed">Մեր նպատակն է <strong>դյուրին դարձնել աշխատանքի դիմելու գործընթացը</strong>՝ տրամադրելով գործիքներ, որոնք կօգնեն Ձեզ ներկայացնել Ձեր կարողությունները լավագույն ձևով։ CV-ագիր-ը նախագծված է այնպես, որ այն լինի <strong>պարզ, արագ և արդյունավետ</strong>, անկախ նրանից՝ դուք փորձառու մասնագետ եք, թե նոր եք մուտք գործում աշխատաշուկա։</p>
               </section>
               <section className="bg-card py-16 px-6 sm:px-12 md:px-24 lg:px-40 text-center">
                    <h2 className="text-3xl font-bold mb-6">Կապվեք մեզ հետ</h2>
                    <p className="text-lg text-card-foreground leading-relaxed">Եթե ունեք հարցեր, առաջարկներ կամ ցանկանում եք համագործակցել, կարող եք կապ հաստատել մեզ հետ <strong>«Հետադարձ կապ»</strong> էջի միջոցով։</p>
               </section>
          </PageLayout>
     )
}