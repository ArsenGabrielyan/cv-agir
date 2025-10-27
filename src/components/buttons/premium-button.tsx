"use client"
import usePremiumModal from "@/hooks/use-premium-modal";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function PremiumButton({className, children, ...props}: ButtonProps){
     const premiumModal = usePremiumModal();
     const t = useTranslations("buttons");
     return (
          <Button {...props} className={cn("w-full",className)} onClick={()=>premiumModal.setOpen(true)}>
               {!children ? t("upgrade") : children}
          </Button>
     )
}