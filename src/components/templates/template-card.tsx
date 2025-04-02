"use client"
import { ResumeTemplate } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { useCurrentSubscriptionLevel } from "@/hooks/use-current-user";
import { getAvailableFeatures } from "@/lib/permission";
import usePremiumModal from "@/hooks/use-premium-modal";

interface TemplateCardProps{
     data: ResumeTemplate
}
export default function TemplateCard({data}: TemplateCardProps){
     const [imageUrl] = useState(data.imageName ? `/templates/${data.imageName}` : `/template-img.webp`);
     const subscriptionLevel = useCurrentSubscriptionLevel();
     const {canUseTemplates} = getAvailableFeatures(subscriptionLevel)
     return (
          <div className="rounded-xl bg-card text-card-foreground border shadow max-w-[350px]">
               <Image src={imageUrl} alt="template-thumbnail" width={350} height={550}/>
               <div className="space-y-4 p-4">
                    <h2 className="text-lg font-semibold flex justify-between items-center">
                         {data.name}
                         {data.isPremium && (
                              <Tooltip>
                                   <TooltipTrigger className="cursor-auto"><Star className="text-primary"/></TooltipTrigger>
                                   <TooltipContent>
                                        <p>Պրեմիում շաբլոն</p>
                                   </TooltipContent>
                              </Tooltip>
                         )}
                    </h2>
                    <p className="text-sm text-muted-foreground">{data.description}</p>
                    <ResumeTemplateButton isPremium={data.isPremium! && !canUseTemplates} templateId={data.id}/>
               </div>
          </div>
     )
}

interface ResumeTemplateButtonProps{
     isPremium: boolean,
     templateId: string
}
function ResumeTemplateButton({isPremium, templateId}: ResumeTemplateButtonProps){
     const {setOpen} = usePremiumModal();
     return !isPremium ? (
          <Button className="w-full" asChild>
               <Link href={`/editor?templateId=${templateId}`}>Օգտագործել</Link>
          </Button>
     ) : (
          <Button className="w-full" onClick={()=>setOpen(true)}>
               Օգտագործել
          </Button>
     )
}