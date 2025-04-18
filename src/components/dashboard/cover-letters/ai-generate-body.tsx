import { generateCoverLetterBody } from "@/actions/ai";
import LoadingButton from "@/components/buttons/loading-button";
import { useSubscriptionLevel } from "@/context/subscription-level-provider";
import usePremiumModal from "@/hooks/use-premium-modal";
import { getAvailableFeatures } from "@/lib/permission";
import { CoverLetterFormType } from "@/data/types/schema";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GenerateLetterBodyButtonProps{
     coverLetterData: CoverLetterFormType,
     onBodyGenerated: (body: string) => void,
     disabled?: boolean
}
export default function GenerateLetterBodyButton({coverLetterData, onBodyGenerated, disabled}: GenerateLetterBodyButtonProps){
     const subscriptionMethod = useSubscriptionLevel();
     const premiumModal = usePremiumModal();
     const {canUseAITools} = getAvailableFeatures(subscriptionMethod)
     const [loading, setLoading] = useState(false);

     const handleClick = async()=>{
          if(!canUseAITools){
               premiumModal.setOpen(true);
               return;
          }
          try{
               setLoading(true);
               const aiResponse = await generateCoverLetterBody(coverLetterData);
               onBodyGenerated(aiResponse);
          } catch (error){
               console.error(error);
               toast.error("Ինչ-որ բան սխալ գնաց։ Խնդրում ենք նորից փորձել")
          } finally{
               setLoading(false)
          }
     }

     return (
          <LoadingButton
               loading={loading}
               disabled={disabled}
               variant="outline"
               type="button"
               onClick={handleClick}
          >
               <Sparkles className="size-4"/>
               Գեներացնել (ԱԲ)
          </LoadingButton>
     )
}