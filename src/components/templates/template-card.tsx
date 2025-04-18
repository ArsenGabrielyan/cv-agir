"use client"
import { ResumeTemplate, UserPlan } from "@db/client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import { getAvailableFeatures } from "@/lib/permission";
import PremiumButton from "@/components/buttons/premium-button";

interface TemplateCardProps{
     data: ResumeTemplate,
     subscriptionLevel: UserPlan
}
export default function TemplateCard({data, subscriptionLevel}: TemplateCardProps){
     const [imageUrl] = useState(data.imageName ? `/templates/${data.imageName}` : `/template-img.webp`);
     const {canUseTemplates} = getAvailableFeatures(subscriptionLevel)
     return (
          <div className="group rounded-xl bg-card text-card-foreground border shadow max-w-[350px]">
               <div className="relative">
                    <Image src={imageUrl} alt="template-thumbnail" width={350} height={550}/>
                    {data.isPremium && (
                         <div className="absolute top-0 left-0 bg-background/95 text-foreground p-2 text-base rounded-br-xl flex items-center gap-2">
                              <Star className="size-6 text-primary"/>
                              <p className="hidden group-hover:block font-semibold">Պրեմիում</p>
                         </div>
                    )}
               </div>
               <div className="space-y-4 p-4">
                    <h2 className="text-lg font-semibold">
                         {data.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">{data.description}</p>
                    <ResumeTemplateButton isPremium={data.isPremium as boolean && !canUseTemplates} templateId={data.id}/>
               </div>
          </div>
     )
}

interface ResumeTemplateButtonProps{
     isPremium: boolean,
     templateId: string
}
function ResumeTemplateButton({isPremium, templateId}: ResumeTemplateButtonProps){
     return !isPremium ? (
          <Button className="w-full" asChild>
               <Link href={`/editor?templateId=${templateId}`}>Օգտագործել</Link>
          </Button>
     ) : (
          <PremiumButton>Օգտագործել</PremiumButton>
     )
}