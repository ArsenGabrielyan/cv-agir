import { ResumeInfoFormLoader, ResumeDetailsFormLoader, ResumeOptionalDetailsFormLoader } from "@/components/loaders/form"
import { IEditorStep, ResumeFormProps } from "@/data/types"
import dynamic from "next/dynamic"

export const steps: IEditorStep<ResumeFormProps>[] = [
     {
          title: "Ընդհանուր ինֆորմացիա",
          component: dynamic(()=>import("@/components/dashboard/resumes/forms/resume-info-form"),{
               loading: ResumeInfoFormLoader
          }),
          key: "resume-info"
     },
     {
          title: "Ռեզյումեի մանրամասներ",
          component: dynamic(()=>import("@/components/dashboard/resumes/forms/resume-details-form"),{
               loading: ResumeDetailsFormLoader
          }),
          key: "resume-details"
     },
     {
          title: "Լրացուցիչ մանրամասներ",
          component: dynamic(()=>import("@/components/dashboard/resumes/forms/resume-optional-details-form"),{
               loading: ResumeOptionalDetailsFormLoader
          }),
          key: "optional-details"
     }
]