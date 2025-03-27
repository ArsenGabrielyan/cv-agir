import { generateSummary } from "@/actions/ai";
import LoadingButton from "@/components/loading-button";
import { ResumeFormType } from "@/schemas/types";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GenerateSummaryButtonProps{
     resumeData: ResumeFormType,
     onSummaryGenerated: (summary: string) => void
     disabled?: boolean
}
export default function GenerateSummaryButton({resumeData, onSummaryGenerated, disabled}: GenerateSummaryButtonProps){
     // TODO: Block For Free Users

     const [loading, setLoading] = useState(false);

     const handleClick = async()=>{
          try{
               setLoading(true);
               const aiResponse = await generateSummary(resumeData);
               onSummaryGenerated(aiResponse);
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