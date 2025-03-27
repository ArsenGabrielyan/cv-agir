"use client"
import { cn } from "@/lib/utils";
import { PRICING_DATA } from "@/data/constants/landing-page";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import PricingCard from "@/components/landing-page/pricing-card";

export default function Pricing(){
     const [isYearly, setIsYearly] = useState(false)
     const [selected, setSelected] = useState(PRICING_DATA[0].name);
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
     const handleSelectPlan = (name: string) => {
          setSelected(name)
     }
     return (
          <>
               {/* TODO: Integrate Custom Subscription System, Add a Feature To Purchase Subscription For Yearly Or Monthly (Soon With 7 Day Trial), and Add a 7 Day Trial Text */}
               <div className="flex items-center justify-center space-x-3">
                    <p>Ամսական</p>
                    <Switch id="billing-mode" checked={isYearly} onCheckedChange={handleCheckedChange}/>
                    <p>Տարեկան</p>
               </div>
               <div className={getGridClass()}>
                    {PRICING_DATA.map((data)=>(
                         <PricingCard key={data.id} data={data} isYearly={isYearly} selected={selected} onSelect={handleSelectPlan}/>
                    ))}
               </div>
          </>
     )
}