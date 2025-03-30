"use client"
import { Resume, ResumeTemplate } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter, useSearchParams } from "next/navigation"
import { steps } from "./steps"
import Breadcrumbs from "./breadcrumbs"
import FormFooter from "./form-footer"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { ResumeFormType } from "@/schemas/types"
import ResumePreviewSection from "./resume-preview-section"
import { cn } from "@/lib/utils"
import useUnsavedChangesWarning from "@/hooks/use-unsaved-changes"
import useAutoSave from "@/hooks/use-auto-save"
import { mapToResumeValues } from "@/data/helpers/other"
import { absoluteUrl } from "@/lib/utils";
import QRCode from "qrcode";

interface ResumeEditorProps {
     resumeToEdit: Resume | null;
     template: ResumeTemplate | null;
}
export default function ResumeEditor({resumeToEdit,template}: ResumeEditorProps){
     const searchParams = useSearchParams();
     const router = useRouter();
     const [resumeData, setResumeData] = useState<ResumeFormType>(resumeToEdit ? mapToResumeValues(resumeToEdit) : {});
     const [showSmResumePreview, setShowSmResumePreview] = useState(false);
     const {isSaving, hasUnsavedChanges} = useAutoSave(resumeData,template?.id)
     const [qrImg, setQrImg] = useState("/qr-placeholder.png");
     const currStep = searchParams.get("step") || steps[0].key;
     const setStep = (key: string) => {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("step",key);
          router.push(`?${newSearchParams.toString()}`)
     }
     const FormComponent = steps.find(
          step=>step.key===currStep
     )?.component

     useUnsavedChangesWarning(hasUnsavedChanges);

     useEffect(()=>{
          if(template){
               setResumeData(prev=>({...prev,templateId: template.id}))
          }
     },[template])

     useEffect(()=>{
          if(resumeToEdit){
               const initQR = async() => {
                    const img = resumeToEdit.id ? await QRCode.toDataURL(absoluteUrl(`/cv/${resumeToEdit.id}`)) : "/qr-placeholder.png";
                    setQrImg(img)
               }
               initQR();
          } else {
               setQrImg("/qr-placeholder.png")
          }
     },[resumeToEdit])
     return (
          <div className="flex grow flex-col">
               <header className="border-b px-3 py-5 flex flex-col items-center justify-center gap-y-4">
                    <div className="space-y-1.5 text-center">
                         <h1 className="text-lg md:text-xl lg:text-2xl font-semibold flex justify-between items-start">
                              Պատրաստել Ձեր ռեզյումեն
                              {isSaving && (
                                   <span className="text-base font-normal flex items-center gap-2 text-muted-foreground">
                                        <Loader2 className="animate-spin"/>Պահպանվում է․․․
                                   </span>
                              )}
                         </h1>
                         <p className="text-sm text-muted-foreground">Պատրաստել Ձեր ռեզյումեն հետևելով նշված քայլերին։ Ձեր գործընթացը ավտոմատիկ կպահպանվի։</p>
                    </div>
               </header>
               <main className="relative grow">
                    <div className="absolute bottom-0 top-0 w-full flex">
                         <ScrollArea className={cn("w-full md:w-1/2 p-4 md:block",showSmResumePreview && "hidden")}>
                              <div className="space-y-6">
                                   <Breadcrumbs currStep={currStep} setCurrStep={setStep}/>
                                   {FormComponent && (
                                        <FormComponent
                                             resumeData={resumeData}
                                             setResumeData={setResumeData}
                                        />
                                   )}
                              </div>
                         </ScrollArea>
                         <div className="grow md:border-r"/>
                         <ResumePreviewSection
                              resumeData={resumeData}
                              setResumeData={setResumeData}
                              template={template}
                              qrImg={qrImg}
                              className={cn(showSmResumePreview && "flex")}
                              isEditing={!!resumeToEdit}
                         />
                    </div>
               </main>
               <FormFooter currStep={currStep} setCurrStep={setStep} setShowSmResumePreview={setShowSmResumePreview} showSmResumePreview={showSmResumePreview}/>
          </div>
     )
}