import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSubscriptionLevel } from "@/context/subscription-level-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import usePremiumModal from "@/hooks/use-premium-modal";
import { getAvailableFeatures } from "@/lib/permission";
import { PaletteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react"
import {Color, ColorChangeHandler, TwitterPicker} from "react-color"

interface ColorPickerProps{
     color: Color | undefined
     onChange: ColorChangeHandler,
}
export default function ColorPicker({color,onChange}: ColorPickerProps){
     const subscriptionMethod = useSubscriptionLevel();
     const premiumModal = usePremiumModal();
     const errMsg = useTranslations("error-messages")
     const {canUseCustomization} = getAvailableFeatures(subscriptionMethod,errMsg)
     const [showPopover, setShowPopover] = useState(false);
     const isMobile = useIsMobile();
     const t = useTranslations("editor.change-style")
     return (
          <Popover open={showPopover} onOpenChange={setShowPopover}>
               <PopoverTrigger asChild>
                    <Button
                         size="icon"
                         variant="outline"
                         title={t("color")}
                         onClick={()=>{
                              if(!canUseCustomization){
                                   premiumModal.setOpen(true)
                                   return;
                              }
                              setShowPopover(true)
                         }}
                    >
                         <PaletteIcon className="size-5"/>
                    </Button>
               </PopoverTrigger>
               <PopoverContent className="border-none bg-transparent shadow-none" align="end">
                    <TwitterPicker color={color} onChange={onChange} triangle={isMobile ? "top-left" : "top-right"}/>
               </PopoverContent>
          </Popover>
     )
}