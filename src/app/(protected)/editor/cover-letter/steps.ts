import CoverLetterDetailsForm from "@/components/dashboard/cover-letters/forms/cl-details-form"
import CoverLetterInfoForm from "@/components/dashboard/cover-letters/forms/cl-info-form"
import { CoverLetterFormProps, IEditorStep} from "@/data/types"

export const steps: IEditorStep<CoverLetterFormProps>[] = [
     {title: "Աշխատողի ինֆորմացիա", component: CoverLetterInfoForm, key: "cl-info"},
     {title: "Նամակի մանրամասներ", component: CoverLetterDetailsForm, key: "cl-details"}
]