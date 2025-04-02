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
import { IPricing } from "@/data/types";
import { useMemo } from "react";
import Link from "next/link";
import { UserPlan } from "@prisma/client";

interface PricingCardProps{
     data: IPricing,
     isYearly: boolean,
     selected: UserPlan
}
export default function PricingCard({data,isYearly, selected}: PricingCardProps){
     const {id,name,description,price,highlighted,perks,planName} = data;
     const cardPrice = useMemo(()=>isYearly ? price * 12 : price,[isYearly, price])
     const isFree = cardPrice===0
     const isSelected = planName===selected
     return (
          <Card key={id} className={cn("text-left",highlighted && "border-primary",)}>
               <CardHeader>
                    <CardTitle className="text-3xl">{name}</CardTitle>
                    <CardDescription>{description}</CardDescription>
               </CardHeader>
               <CardContent>
                    <p className="text-4xl md:text-5xl">${cardPrice.toFixed(2)}/{isYearly ? "տարի" : "ամիս"}</p>
                    <ul className="flex flex-col space-y-2 mt-5">
                         {perks.map(perk=>(
                              <li key={perk.id} className={cn("flex gap-x-3",!perk.included && "text-muted-foreground")}>{perk.included ? <CheckCircle className="text-primary"/> : <MinusCircle/>} {perk.name}</li>
                         ))}
                    </ul>
               </CardContent>
               <CardFooter className="w-full">
                    {isFree && selected==="premium" ? (
                         <Button variant={highlighted ? "default" : "secondary"} className="w-full" disabled={isFree && selected==="premium"}>Դուք արդեն պրեմիում պլանում եք</Button>
                    ) : (isFree || isSelected) ? (
                         <Button variant={highlighted ? "default" : "secondary"} className="w-full" disabled={isFree || isSelected}>
                              Ընթացիկ տարբերակ
                         </Button>
                    ) : (
                         <Button variant={highlighted ? "default" : "secondary"} className="w-full" asChild>
                              <Link href={`/checkout?plan=${data.planName}&planType=${isYearly ? "yearly" : "monthly"}`}>Գնել առաջարկը</Link>
                         </Button>
                    )}
               </CardFooter>
          </Card>
     )
}