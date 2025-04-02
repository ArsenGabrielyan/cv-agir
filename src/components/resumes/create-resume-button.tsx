"use client"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import usePremiumModal from "@/hooks/use-premium-modal"

interface CreateResumeButtonProps{
     canCreate: boolean
}
export default function CreateResumeButton({canCreate}: CreateResumeButtonProps){
     const premiumModal = usePremiumModal();

     return canCreate ? (
          <Button asChild className="flex items-center gap-2">
               <Link href="/editor"><PlusCircle className="size-5"/> Ստեղծել Ռեզյումե</Link>
          </Button>
     ) : (
          <Button onClick={()=>premiumModal.setOpen(true)} className="flex items-center gap-2">
               <PlusCircle className="size-5"/> Ստեղծել Ռեզյումե
          </Button>
     )
}