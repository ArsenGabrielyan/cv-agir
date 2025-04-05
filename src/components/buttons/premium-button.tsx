"use client"
import usePremiumModal from "@/hooks/use-premium-modal";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PremiumButton({className, children, ...props}: ButtonProps){
     const premiumModal = usePremiumModal();
     return (
          <Button {...props} className={cn("w-full",className)} onClick={()=>premiumModal.setOpen(true)}>
               {!children ? "Անցել պրեմիումի" : children}
          </Button>
     )
}