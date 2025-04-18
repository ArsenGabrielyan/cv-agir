import * as z from "zod"
import { AccountSettingsSchema } from "@/schemas/settings"
import { CheckoutFormSchema, ContactSchema, CoverLetterFormSchema, CreditCardSchema, LoginSchema, NewPasswordSchema, RegisterSchema, ResetSchema, ResumeDetailsSchema, ResumeFormSchema, ResumeInfoSchema, ResumeOptionalDetailsSchema, DocStyleSchema, CoverLetterInfoSchema, CoverLetterDetailsSchema } from "@/schemas"
import { GenerateDescriptionSchema, GenerateLetterBodySchema, GenerateSummarySchema } from "@/schemas/ai"

// Settings
export type AccountSettingsType = z.infer<typeof AccountSettingsSchema>

// Contact Page and Auth
export type ContactFormType = z.infer<typeof ContactSchema>
export type LoginType = z.infer<typeof LoginSchema>
export type NewPasswordType = z.infer<typeof NewPasswordSchema>
export type RegisterFormType = z.infer<typeof RegisterSchema>
export type ResetPassType = z.infer<typeof ResetSchema>

// Resume Form
export type ResumeFormType = Omit<z.infer<typeof ResumeFormSchema>,"profileImg"> & {
     id?: string,
     templateId?: string,
     profileImg?: File | string | null,
     qrImg?: string
}
export type ResumeInfoType = z.infer<typeof ResumeInfoSchema>
export type ResumeDetailsType = z.infer<typeof ResumeDetailsSchema>
export type ResumeOptionalDetailsType = z.infer<typeof ResumeOptionalDetailsSchema>
export type DocStyleType = z.infer<typeof DocStyleSchema>
export type WorkExperienceType = NonNullable<ResumeDetailsType["experience"]>[number]

// Cover Letter Form
export type CoverLetterInfoType = z.infer<typeof CoverLetterInfoSchema>
export type CoverLetterDetailsType = z.infer<typeof CoverLetterDetailsSchema>
export type CoverLetterFormType = Omit<z.infer<typeof CoverLetterFormSchema>,"profileImg"> & {
     id?: string,
     profileImg?: File | string | null,
}

// Gemini AI Inputs To Generate From AI
export type GenerateSummaryInput = z.infer<typeof GenerateSummarySchema>
export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionSchema>
export type GenerateLetterBodyInput = z.infer<typeof GenerateLetterBodySchema>

// Subscription Form
export type CheckoutFormType = z.infer<typeof CheckoutFormSchema>
export type CreditCardType = z.infer<typeof CreditCardSchema>