import * as z from "zod"
import { AccountSettingsSchema, ResumeSettingsSchema } from "./settings"
import { CheckoutFormSchema, ContactSchema, CreditCardSchema, LoginSchema, NewPasswordSchema, RegisterSchema, ResetSchema, ResumeDetailsSchema, ResumeFormSchema, ResumeInfoSchema, ResumeOptionalDetailsSchema, ResumeStyleSchema } from "."
import { GenerateDescriptionSchema, GenerateSummarySchema } from "./ai"

// Settings
export type AccountSettingsType = z.infer<typeof AccountSettingsSchema>
export type ResumeSettingsType = z.infer<typeof ResumeSettingsSchema>

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
export type ResumeStyleType = z.infer<typeof ResumeStyleSchema>
export type WorkExperienceType = NonNullable<ResumeDetailsType["experience"]>[number]

// Gemini AI Inputs To Generate From AI
export type GenerateSummaryInput = z.infer<typeof GenerateSummarySchema>
export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionSchema>

// Subscription Form
export type CheckoutFormType = z.infer<typeof CheckoutFormSchema>
export type CreditCardType = z.infer<typeof CreditCardSchema>