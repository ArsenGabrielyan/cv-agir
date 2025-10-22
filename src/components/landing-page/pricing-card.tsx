"use client"
import {
     Card,
     CardContent,
     CardDescription,
     CardFooter,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import { CheckCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IPricing } from "@/lib/types";
import { useMemo } from "react";
import { Link } from "@/i18n/routing";
import { UserPlan } from "@db";
import { useTranslations } from "next-intl";
import { MAX_FREE_RESUMES } from "@/lib/constants";

interface PricingCardProps{
     data: IPricing,
     isYearly: boolean,
     selected: UserPlan,
     t: ReturnType<typeof useTranslations<"pricing">>
}
export default function PricingCard({data,isYearly, selected, t}: PricingCardProps){
     const {id,price,highlighted,perks,planName} = data;
     const cardPrice = useMemo(()=>isYearly ? price * 12 : price,[isYearly, price])
     const isFree = cardPrice===0
     const isSelected = planName===selected;
     return (
          <Card key={id} className={cn("text-left",highlighted && "border-primary",)}>
               <CardHeader>
                    <CardTitle className="text-3xl">{t(isFree ? "free.title" : "premium.title")}</CardTitle>
                    <CardDescription>{t(isFree ? "free.description" : "premium.description")}</CardDescription>
               </CardHeader>
               <CardContent>
                    <p className="text-4xl md:text-5xl">${cardPrice.toFixed(2)}/{isYearly ? t("annual.prefix") : t("monthly.prefix")}</p>
                    <ul className="flex flex-col space-y-2 mt-5">
                         {perks.map((perk,i)=>(
                              <li key={`perk-${i+1}`} className={cn("flex gap-x-3",!perk.included && "text-muted-foreground")}>{perk.included ? <CheckCircle className="text-primary"/> : <MinusCircle/>} {t(perk.name,{count: MAX_FREE_RESUMES})}</li>
                         ))}
                    </ul>
               </CardContent>
               <CardFooter className="w-full">
                    {isFree && selected==="premium" ? (
                         <Button variant={highlighted ? "default" : "secondary"} className="w-full" disabled={isFree && selected==="premium"}>{t("premium.currStatus")}</Button>
                    ) : (isFree || isSelected) ? (
                         <Button variant={highlighted ? "default" : "secondary"} className="w-full" disabled={isFree || isSelected}>
                              {t("free.currStatus")}
                         </Button>
                    ) : (
                         <Button variant={highlighted ? "default" : "secondary"} className="w-full" asChild>
                              <Link href={`/checkout?plan=${data.planName}&planType=${isYearly ? "yearly" : "monthly"}`}>{t("buy-it")}</Link>
                         </Button>
                    )}
               </CardFooter>
          </Card>
     )
}