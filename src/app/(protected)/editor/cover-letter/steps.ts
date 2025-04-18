import {CoverLetterDetailsFormLoader, CoverLetterInfoFormLoader} from "@/components/loaders/form"
import { CoverLetterFormProps, IEditorStep} from "@/data/types"
import dynamic from "next/dynamic"

export const steps: IEditorStep<CoverLetterFormProps>[] = [
     {
          title: "Աշխատողի ինֆորմացիա",
          component: dynamic(()=>import("@/components/dashboard/cover-letters/forms/cl-info-form"),{
               loading: CoverLetterInfoFormLoader
          }),
          key: "cl-info"
     },
     {
          title: "Նամակի մանրամասներ",
          component: dynamic(()=>import("@/components/dashboard/cover-letters/forms/cl-details-form"),{
               loading: CoverLetterDetailsFormLoader
          }),
          key: "cl-details"
     }
]