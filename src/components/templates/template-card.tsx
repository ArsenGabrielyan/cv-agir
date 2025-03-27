"use client"
import { ResumeTemplate } from "@prisma/client";
import {  useState } from "react";
import { getImageUrl } from "@/data/helpers/storage";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";

interface TemplateCardProps{
     data: ResumeTemplate
}
export default function TemplateCard({data}: TemplateCardProps){
     const [imageUrl] = useState(getImageUrl(`templates/${data.imageName}`));
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
                    <Button className="w-full" asChild>
                         <Link href={`/editor?templateId=${data.id}`}>Օգտագործել</Link>
                    </Button>
               </div>
          </div>
     )
}