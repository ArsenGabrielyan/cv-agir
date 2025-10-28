"use client"
import { ResumeTemplate, UserPlan } from "@db";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getAvailableFeatures } from "@/lib/permission";
import PremiumButton from "@/components/buttons/premium-button";
import { useTranslations } from "next-intl";

interface TemplateCardProps{
     data: ResumeTemplate,
     subscriptionLevel: UserPlan,
     t: ReturnType<typeof useTranslations<"templates">>
}
export default function TemplateCard({data, subscriptionLevel, t}: TemplateCardProps){
     const [imageUrl] = useState(data.imageName ? `/templates/${data.imageName}` : `/template-img.webp`);
     const errMsg = useTranslations("error-messages")
     const {canUseTemplates} = getAvailableFeatures(subscriptionLevel,errMsg)
     return (
          <div className="group rounded-xl bg-card text-card-foreground border shadow max-w-[350px]">
               <div className="relative">
                    <Image src={imageUrl} alt="template-thumbnail" width={350} height={550}/>
                    {data.isPremium && (
                         <div className="absolute top-0 left-0 bg-background/95 text-foreground p-2 text-base rounded-br-xl flex items-center gap-2">
                              <Star className="size-6 text-primary"/>
                              <p className="hidden group-hover:block font-semibold">{t("premium")}</p>
                         </div>
                    )}
               </div>
               <div className="space-y-4 p-4">
                    <h2 className="text-lg font-semibold">
                         {data.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">{data.description}</p>
                    <ResumeTemplateButton isPremium={data.isPremium as boolean && !canUseTemplates} templateId={data.id} useButtonTxt={t("useTemplate")}/>
               </div>
          </div>
     )
}

interface ResumeTemplateButtonProps{
     isPremium: boolean,
     templateId: string,
     useButtonTxt: string
}
function ResumeTemplateButton({isPremium, templateId, useButtonTxt}: ResumeTemplateButtonProps){
     return !isPremium ? (
          <Button className="w-full" asChild>
               <Link href={`/editor?templateId=${templateId}`}>{useButtonTxt}</Link>
          </Button>
     ) : (
          <PremiumButton>{useButtonTxt}</PremiumButton>
     )
}