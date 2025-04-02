import ResumeDetailsForm from "@/components/resumes/resume-editor/forms/resume-details-form"
import ResumeInfoForm from "@/components/resumes/resume-editor/forms/resume-info-form"
import ResumeOptionalDetailsForm from "@/components/resumes/resume-editor/forms/resume-optional-details-form"
import { ResumeFormProps } from "@/data/types"

export const steps: {
     title: string,
     component: React.ComponentType<ResumeFormProps>,
     key: string
}[] = [
     {title: "Ընդհանուր ինֆորմացիա", component: ResumeInfoForm, key: "resume-info"},
     {title: "Ռեզյումեի մանրամասներ", component: ResumeDetailsForm, key: "resume-details"},
     {title: "Լրացուցիչ մանրամասներ", component: ResumeOptionalDetailsForm, key: "optional-details"}
]