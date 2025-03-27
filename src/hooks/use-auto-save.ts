import { ResumeFormType } from "@/schemas/types";
import useDebounce from "./use-debounce";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { saveResume } from "@/actions/resume/save-resume";
import { fileReplacer } from "@/data/helpers/other";

export default function useAutoSave(resumeData: ResumeFormType, templateId?: string){
     const searchParams = useSearchParams();
     const router = useRouter();
     
     const debouncedData = useDebounce(resumeData,1500);

     const [resumeId, setResumeId] = useState(resumeData.id)
     const [lastSaved, setLastSaved] = useState(structuredClone(resumeData))
     const [isSaving, setIsSaving] = useState(false);
     const [isError, setIsError] = useState(false)

     useEffect(()=>{
          setIsError(false);
     },[debouncedData])

     useEffect(()=>{
          async function save(){
               try{
                    setIsSaving(true);
                    setIsError(false);
                    const newData = structuredClone(debouncedData);
                    const updated = await saveResume({
                         ...newData,
                         ...(JSON.stringify(lastSaved.profileImg, fileReplacer)===JSON.stringify(newData.profileImg,fileReplacer) && {
                              profileImg: undefined
                         }),
                         id: resumeId,
                    },templateId);
                    setResumeId(updated.id);
                    setLastSaved(newData);
                    if(searchParams.get("resumeId")!==updated.id){
                         const newSearchParams = new URLSearchParams(searchParams);
                         newSearchParams.set("resumeId",updated.id);
                         router.replace(`?${newSearchParams.toString()}`)
                    }
               } catch(error){
                    setIsError(true);
                    console.error(error)
                    toast.error("Չհաջողվեց պահպանել ռեզյումեն",{
                         action: {
                              label: "Նորից փորձել",
                              onClick: () => save()
                         }
                    })
               } finally {
                    setIsSaving(false)
               }
          }
          const hasUnsavedChanges = JSON.stringify(debouncedData,fileReplacer)!==JSON.stringify(lastSaved,fileReplacer);
          if(hasUnsavedChanges && debouncedData && !isSaving && !isError){
               save()
          }
     },[debouncedData, isError, isSaving, lastSaved, resumeId, router, searchParams, templateId])

     return {
          isSaving,
          hasUnsavedChanges: JSON.stringify(resumeData)!==JSON.stringify(lastSaved)
     }
}