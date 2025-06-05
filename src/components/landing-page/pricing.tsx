"use client"
import { cn } from "@/lib/utils";
import { PRICING_DATA } from "@/data/constants/landing-page";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import PricingCard from "@/components/landing-page/pricing-card";
import { useCurrentSubscriptionLevel, useCurrentUser } from "@/hooks/use-current-user";

export default function Pricing(){
     const user = useCurrentUser();
     const subscriptionLevel = useCurrentSubscriptionLevel(user && user?.subscriptionEndDate ? new Date(user?.subscriptionEndDate) < new Date() : true);
     const [isYearly, setIsYearly] = useState(false)
     const getGridClass = () => {
          const count = PRICING_DATA.length;
          return cn(
               "grid gap-3",
               count >= 1 && "grid-cols-1",
               count >= 2 && "md:grid-cols-2",
               count >= 3 && "lg:grid-cols-3",
               "w-full max-w-7xl text-center mt-10 pb-10"
          )
     }
     const handleCheckedChange = (checked: boolean) => setIsYearly(checked)
     return (
          <>
               <div className="flex items-center justify-center space-x-3">
                    <p>Ամսական</p>
                    <Switch title="Բաժանորդագրության տեսակ" id="billing-mode" checked={isYearly} onCheckedChange={handleCheckedChange}/>
                    <p>Տարեկան</p>
               </div>
               <div className={getGridClass()}>
                    {PRICING_DATA.map((data)=>(
                         <PricingCard key={data.id} data={data} isYearly={isYearly} selected={subscriptionLevel}/>
                    ))}
               </div>
          </>
     )
}