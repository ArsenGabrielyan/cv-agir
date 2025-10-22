"use client"
import { PRICING_DATA } from "@/lib/constants/landing-page";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/use-premium-modal";
import { Link } from "@/i18n/routing";

export default function PremiumModal(){
     const {price, perks, planName} = PRICING_DATA[1];
     const [isYearly, setIsYearly] = useState(false);
     const cardPrice = useMemo(()=>isYearly ? price * 12 : price,[isYearly, price])
     const {open, setOpen} = usePremiumModal()
     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Անցեք պրեմիումի</DialogTitle>
                         <DialogDescription>Բաժանորդագրվեք մեր պրեմիում տարբերակին բազում հնարավորություններ ձեռք բերելու համար</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                         <div className="flex items-center justify-center space-x-3">
                              <p>Ամսական</p>
                              <Switch title="Բաժանորդագրության տեսակ" id="billing-mode" checked={isYearly} onCheckedChange={setIsYearly}/>
                              <p>Տարեկան</p>
                         </div>
                         <p className="text-center text-3xl md:text-4xl xl:text-5xl font-semibold">${cardPrice.toFixed(2)}/{isYearly ? "տարի" : "ամիս"}</p>
                         <ul className="space-y-3">
                              {perks.map(perk=>(
                                   <li key={perk.id} className={cn("flex gap-x-3",!perk.included && "text-muted-foreground")}>{perk.included ? <CheckCircle className="text-primary"/> : <MinusCircle/>} {perk.name}</li>
                              ))}
                         </ul>
                    </div>
                    <DialogFooter>
                         <Button type="button" className="w-full" asChild>
                              <Link href={`/checkout?plan=${planName}&planType=${isYearly ? "yearly" : "monthly"}`}>Անցել պրեմիումի</Link>
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
}