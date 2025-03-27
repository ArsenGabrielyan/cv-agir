import { ResumeFormType } from "@/schemas/types";
import useDebounce from "./use-debounce";
import { useEffect, useState } from "react";
import { isEqual } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { saveResume } from "@/actions/resume/save-resume";

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
          const save = async()=>{
               try{
                    setIsSaving(true);
                    setIsError(false);
                    const newData = structuredClone(debouncedData)
                    const updatedResume = await saveResume({
                         ...newData,
                         ...(lastSaved.profileImg?.toString()===newData?.profileImg?.toString() && {
                              profileImg: undefined
                         }),
                         id: resumeId,
                         templateId
                    })

                    setResumeId(updatedResume.id)
                    setLastSaved(newData);

                    if(searchParams.get("resumeId") !== updatedResume.id){
                         const newSearchParams = new URLSearchParams(searchParams);
                         newSearchParams.set("resumeId",updatedResume.id);
                         router.push(`?${newSearchParams.toString()}`)
                    }

                    setIsSaving(false);
               } catch (error) {
                    setIsError(true)
                    console.error(error);
                    toast.error("Վայ, մի բան սխալ տեղի ունեցավ։",{
                         description: "Չհաջողվեց պահպանել փոփոխությունները",
                         action: {
                              label: "Նորից փորձել",
                              onClick(){
                                   save();
                              }
                         }
                    })
               } finally {
                    setIsSaving(false);
               }
          }
          const hasUnsavedChanges = !isEqual(debouncedData,lastSaved);

          if(hasUnsavedChanges && debouncedData && !isSaving && !isError){
               save();
          }
     },[debouncedData,isSaving,lastSaved,isError, resumeId, searchParams,router, templateId])

     return {
          isSaving,
          hasUnsavedChanges: !isEqual(resumeData,lastSaved)
     }
}