"use client"
import { cn } from "@/lib/utils";
import { PRICING_DATA } from "@/lib/constants/landing-page";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import PricingCard from "@/components/landing-page/pricing-card";
import { useCurrentSubscriptionLevel, useCurrentUser } from "@/hooks/use-current-user";
import { useTranslations } from "next-intl";

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
     const handleCheckedChange = (checked: boolean) => setIsYearly(checked);
     const t = useTranslations("pricing");
     return (
          <section className="flex justify-center items-center flex-col space-y-4 w-full px-3" id="pricing">
               <h2 className="text-2xl sm:text-3xl md:text-4xl space-y-5 font-bold">{t("title")}</h2>
               <div className="flex items-center justify-center space-x-3">
                    <p>{t("monthly.name")}</p>
                    <Switch title={t("subType")} id="billing-mode" checked={isYearly} onCheckedChange={handleCheckedChange}/>
                    <p>{t("annual.name")}</p>
               </div>
               <div className={getGridClass()}>
                    {PRICING_DATA.map((data)=>(
                         <PricingCard t={t} key={data.id} data={data} isYearly={isYearly} selected={subscriptionLevel}/>
                    ))}
               </div>
          </section>
     )
}