"use client"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import usePremiumModal from "@/hooks/use-premium-modal"
import { cn } from "@/lib/utils";

interface CreateButtonProps{
     canCreate: boolean,
     className?: string
}
export function CreateResumeButton({canCreate, className}: CreateButtonProps){
     const premiumModal = usePremiumModal();
     const buttonClass = cn("flex items-center gap-2",className)
     return canCreate ? (
          <Button asChild className={buttonClass}>
               <Link href="/editor"><PlusCircle className="size-5"/> Ստեղծել Ռեզյումե</Link>
          </Button>
     ) : (
          <Button onClick={()=>premiumModal.setOpen(true)} className={buttonClass}>
               <PlusCircle className="size-5"/> Ստեղծել Ռեզյումե
          </Button>
     )
}


export function CreateCoverLetterButton({canCreate, className}: CreateButtonProps){
     const premiumModal = usePremiumModal();
     const buttonClass = cn("flex items-center gap-2",className)
     return canCreate ? (
          <Button asChild className={buttonClass}>
               <Link href="/editor/cover-letter"><PlusCircle className="size-5"/> Ստեղծել Ուղեկցող նամակ</Link>
          </Button>
     ) : (
          <Button onClick={()=>premiumModal.setOpen(true)} className={buttonClass}>
               <PlusCircle className="size-5"/> Ստեղծել Ուղեկցող նամակ
          </Button>
     )
}