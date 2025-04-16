import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSubscriptionLevel } from "@/actions/subscription-system";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Դուք անցել եք պրեմիում տարբերակին։"
}

export default async function Page(){
     const user = await currentUser();
     if(!user || !user.id){
          redirect("/auth/login")
     }
     const subscriptionLevel = await getSubscriptionLevel(user.id);
     if(subscriptionLevel!=="premium"){
          redirect("/dashboard")
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