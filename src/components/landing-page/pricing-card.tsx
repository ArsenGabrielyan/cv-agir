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

interface PricingCardProps{
     data: IPricing,
     isYearly: boolean,
     selected: string,
     onSelect: (name: string) => void
}
export default function PricingCard({data,isYearly,selected,onSelect}: PricingCardProps){
     const {id,name,description,price,highlighted,perks} = data;
     const cardPrice = useMemo(()=>isYearly ? price * 12 : price,[isYearly, price])
     const isSelected = name===selected
     // TODO: Handle A isFree Button On Buying a Subscription
     // const isFree = price===0
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
                    {/* TODO: Integrate Custom Subscription System And Make This Button Functional (Replace isSelected, selected, setSelected and Change onSelect Function) */}
                    <Button variant={highlighted ? "default" : "secondary"} className="w-full" disabled={isSelected} onClick={()=>onSelect(name)}>{isSelected ? "Ընտրված է" : "Գնել առաջարկը"}</Button>
               </CardFooter>
          </Card>
     )
}