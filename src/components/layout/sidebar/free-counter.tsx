"use client"
import { useEffect, useState } from "react";
import { MAX_FREE_RESUMES } from "@/data/constants/other";
import { Progress } from "@/components/ui/progress";
import PremiumButton from "@/components/buttons/premium-button";

interface FreeCounterProps{
     resumeCount: number
}
export default function FreeCounter({resumeCount}: FreeCounterProps){
     const [mounted, setMounted] = useState(false);
     useEffect(()=>{
          setMounted(true);
     },[])
     return !mounted ? null : (
          <div className="bg-card text-card-foreground border shadow-sm rounded-xl p-5 flex flex-col items-center justify-center gap-4">
               <p>{resumeCount} / {MAX_FREE_RESUMES} Անվճար ռեզյումեներ</p>
               <Progress className="h-3" value={(resumeCount/MAX_FREE_RESUMES)*100} />
               <PremiumButton/>
          </div>
     )
}