import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { Link, redirect, routing } from "@/i18n/routing";
import { getSubscriptionLevel } from "@/actions/subscription-system";
import { Metadata } from "next";
import { LocalePageProps } from "@/app/[locale]/layout";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
     title: "Դուք անցել եք պրեմիում տարբերակին։"
}

export default async function Page({params}: LocalePageProps){
     const {locale} = await params
     if (!hasLocale(routing.locales, locale)) {
         notFound();
     }
     const user = await currentUser();
     if(!user || !user.id){
          redirect({
               href: "/auth/login",
               locale
          });
          return;
     }
     const subscriptionLevel = await getSubscriptionLevel(user.id);
     if(subscriptionLevel!=="premium"){
          redirect({
               href: "/dashboard",
               locale
          })
          return;
     }
     return (
          <main className="mx-auto max-w-7xl space-y-6 px-3 py-6 text-center">
               <h1 className="text-3xl font-semibold">Շնորհավորում եմ</h1>
               <p className="text-muted-foreground">Դուք անցել եք պրեմիում տարբերակին։</p>
               <Button asChild>
                    <Link href="/dashboard">Վերադառնալ վահանակ</Link>
               </Button>
          </main>
     )
}