import { Button } from "@/components/ui/button"
import { Circle, Square, Squircle } from "lucide-react"
import {BorderStyles} from "@db/client"
import { useSubscriptionLevel } from "@/context/subscription-level-provider";
import usePremiumModal from "@/hooks/use-premium-modal";
import { getAvailableFeatures } from "@/lib/permission";

const borderStyles = Object.values(BorderStyles);

interface BorderStyleButtonProps{
     borderStyle: BorderStyles | undefined
     onChange: (borderStyle: BorderStyles) => void
}
export default function BorderStyleButton({borderStyle, onChange}: BorderStyleButtonProps){
     const subscriptionMethod = useSubscriptionLevel();
     const premiumModal = usePremiumModal();
     const {canUseCustomization} = getAvailableFeatures(subscriptionMethod)
     const handleClick = () => {
          if(!canUseCustomization){
               premiumModal.setOpen(true);
               return;
          }
          const currStyle = borderStyle ?? borderStyles[0]
          const currIndex = borderStyles.indexOf(currStyle);
          const nextIndex = (currIndex+1) % borderStyles.length;
          onChange(borderStyles[nextIndex])
     }
     const Icon = borderStyle === "square" ? Square : borderStyle === "circle" ? Circle : Squircle
     return (
          <Button
               variant="outline"
               size="icon"
               title="Փոխել եզրագծի ձևը"
               onClick={handleClick}
          >
               <Icon className="size-5"/>
          </Button>
     )
}