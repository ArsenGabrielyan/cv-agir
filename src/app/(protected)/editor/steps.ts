import ResumeDetailsForm from "@/components/dashboard/resumes/forms/resume-details-form"
import ResumeInfoForm from "@/components/dashboard/resumes/forms/resume-info-form"
import ResumeOptionalDetailsForm from "@/components/dashboard/resumes/forms/resume-optional-details-form"
import { IEditorStep, ResumeFormProps } from "@/data/types"

export const steps: IEditorStep<ResumeFormProps>[] = [
     {title: "Ընդհանուր ինֆորմացիա", component: ResumeInfoForm, key: "resume-info"},
     {title: "Ռեզյումեի մանրամասներ", component: ResumeDetailsForm, key: "resume-details"},
     {title: "Լրացուցիչ մանրամասներ", component: ResumeOptionalDetailsForm, key: "optional-details"}
]