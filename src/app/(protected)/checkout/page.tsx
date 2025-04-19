import { getSubscriptionLevel } from "@/actions/subscription-system";
import Logo from "@/components/layout/logo";
import CheckoutForm from "@/components/settings/premium/checkoutForm";
import { PRICING_DATA } from "@/data/constants/landing-page";
import { currentUser } from "@/lib/auth";
import { UserPlan } from "@db";
import { Metadata } from "next";
import { redirect } from "next/navigation"

export const metadata: Metadata = {
     title: "Բաժանորդագրվեք պրեմիում տարբերակին"
}

export default async function CheckoutPage({searchParams}: {
     searchParams: Promise<{plan: UserPlan, planType: "yearly" | "monthly"}>
}){
     const user = await currentUser();
     if(!user || !user.id){
          redirect("/auth/login")
     }
     const {plan, planType} = await searchParams;
     const selectedPlan = PRICING_DATA.find(val=>val.planName===plan);
     const subscriptionLevel = await getSubscriptionLevel(user.id);
     if(!selectedPlan || subscriptionLevel==="premium"){
          redirect("/dashboard")
     }
     const planPrice = planType==="yearly" ? selectedPlan.price*12 : selectedPlan.price;
     return (
          <div className="flex justify-center items-center min-h-dvh p-3 primary-main-bg">
               <div className="bg-card text-card-foreground p-4 shadow border rounded-xl space-y-3 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="space-y-4">
                              <Logo href="/dashboard" width={200} height={70}/>
                              <h1 className="text-lg md:text-xl font-semibold">Բաժանորդագրվեք պրեմիում տարբերակին</h1>
                              <p className="text-2xl md:text-3xl font-semibold">${planPrice.toFixed(2)}/{planType==="yearly" ? "տարի" : "ամիս"}</p>
                              <p className="text-muted-foreground">Բաժանորդագրվեք մեր պրեմիում տարբերակի լիքը հնարավորություններ ձեռք բերելու համար</p>
                         </div>
                         <CheckoutForm period={planType} price={planPrice} plan={plan}/>
                    </div>
               </div>
          </div>
     )
}