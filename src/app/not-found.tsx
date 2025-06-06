import PageLayout from "@/components/layout/page-layout";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound(){
     return (
          <PageLayout landingFooter>
               <section className="flex justify-center items-center text-center flex-col space-y-6 pt-4 sm:pt-40 w-full bg-[url(/bg.svg)]">
                    <div className="font-bold flex flex-col-reverse items-center justify-center">
                         <h1 className="text-3xl lg:text-4xl xl:text-5xl space-y-5">Վայ, էջը չի գտնվել</h1>
                         <h2 className="text-7xl sm:text-8xl md:text-9xl space-y-5 text-primary">404</h2>
                    </div>
                    <p className="text-sm md:text-xl font-light text-muted-foreground">Ձեր փնտրած էջը չի գտնվել: Այն կարող է ջնջվել, տեղափոխվել, վերանվանվել կամ ընդհանրապես գոյություն չունենա:</p>
                    <Link href="/" className={buttonVariants({variant: "default"})}>Վերադառնալ Գլխավոր էջ</Link>
                    <div className="w-full h-40"></div>
               </section>
          </PageLayout>
     )
}