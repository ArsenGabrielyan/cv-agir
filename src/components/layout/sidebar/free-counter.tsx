"use client"
import { useEffect, useState } from "react";
import { MAX_FREE_RESUMES } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import PremiumButton from "@/components/buttons/premium-button";
import { useTranslations } from "next-intl";

interface FreeCounterProps{
     resumeCount: number
}
export default function FreeCounter({resumeCount}: FreeCounterProps){
     const [mounted, setMounted] = useState(false);
     useEffect(()=>{
          setMounted(true);
     },[])
     const t = useTranslations("dashboard")
     return !mounted ? null : (
          <div className="bg-card text-card-foreground border shadow-sm rounded-xl p-5 flex flex-col items-center justify-center gap-4">
               <p>{resumeCount} / {MAX_FREE_RESUMES} {t("free-resumes")}</p>
               <Progress className="h-2" value={(resumeCount/MAX_FREE_RESUMES)*100} />
               <PremiumButton/>
          </div>
     )
}