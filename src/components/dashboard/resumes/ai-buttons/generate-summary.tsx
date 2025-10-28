import { generateSummary } from "@/actions/ai";
import LoadingButton from "@/components/buttons/loading-button";
import { useSubscriptionLevel } from "@/context/subscription-level-provider";
import usePremiumModal from "@/hooks/use-premium-modal";
import { getAvailableFeatures } from "@/lib/permission";
import { ResumeFormType } from "@/schemas/types";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface GenerateSummaryButtonProps{
     resumeData: ResumeFormType,
     onSummaryGenerated: (summary: string) => void
     disabled?: boolean
}
export default function GenerateSummaryButton({resumeData, onSummaryGenerated, disabled}: GenerateSummaryButtonProps){
     const subscriptionMethod = useSubscriptionLevel();
     const premiumModal = usePremiumModal();
     const errMsg = useTranslations("error-messages")
     const {canUseAITools} = getAvailableFeatures(subscriptionMethod,errMsg)
     const [loading, setLoading] = useState(false);

     const handleClick = async()=>{
          if(!canUseAITools){
               premiumModal.setOpen(true);
               return;
          }
          try{
               setLoading(true);
               const aiResponse = await generateSummary(resumeData);
               onSummaryGenerated(aiResponse);
          } catch (error){
               console.error(error);
               toast.error(errMsg("unknownError"))
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