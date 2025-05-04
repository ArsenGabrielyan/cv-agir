import * as z from "zod"
import {
     emailField,
     passwordField,
     optionalArray,
     optionalString,
     optionalEmailString,
     optionalJobTitleString,
     optionalDescString,
     fileField,
     nameField,
     zDescField,
     jobTitleField
} from "./fields"
import {
     ResumeLinkSchema,
     WorkExperienceSchema,
     ResumeEducationSchema,
     ResumeCourseSchema,
     ResumeReferenceSchema,
     ResumeSkillSchema,
} from "./resume"
import {BorderStyles, UserPlan} from "@db"
import { isValidCard } from "@/data/helpers/credit-cards"

export const ResetSchema = z.object({
     email: emailField.trim().transform(email => email.toLowerCase()),
})

export const NewPasswordSchema = z.object({
     password: passwordField.trim()
})

export const LoginSchema = z.object({
     email: emailField.trim().transform(email => email.toLowerCase()),
     password: z.string().min(1,"Մուտքագրեք գաղտնաբառը մուտք գործելու համար").max(64, "Գաղտնաբառը շատ երկար է").trim(),
     code: z.optional(z.string().max(6,"Կոդը շատ երկար է").trim())
})

export const RegisterSchema = z.object({
     name: nameField.trim(),
     email: emailField.trim().transform(email => email.toLowerCase()),
     password: passwordField.trim()
})

export const ContactSchema = z.object({
     name: nameField.trim(),
     email: emailField.trim().transform(email => email.toLowerCase()),
     phone: z.string().regex(/^[0-9+() -]*$/,"Հեռախոսահամարը պետք է պարունակի միայն թվեր և նշաններ (+, -, (, ))").min(8, "Հեռախոսահամարը շատ կարճ է").max(20, "Հեռախոսահամարը շատ երկար է").trim(),
     subject: z.string().min(1,"Մուտքագրեք հաղորդագրության թեմայի անունը").max(100, "Թեման շատ երկար է").trim(),
     message: z.string().min(5, "Հաղորդագրությունը պետք է լինի առնվազն 5 տառ").max(500,"Հաղորդագրությունը շատ երկար է").trim()
})

export const ResumeInfoSchema = z.object({
     title: optionalString,
     description: optionalString,
     fname: optionalString,
     lname: optionalString,
     jobTitle: optionalJobTitleString,
     phone: optionalString,
     address: optionalString,
     email: optionalEmailString,
     summary: optionalDescString,
     hobbies: z.optional(zDescField("Հոբբիներ").trim()).or(z.literal("")),
     profileImg: fileField,
})

export const ResumeDetailsSchema = z.object({
     experience: optionalArray(WorkExperienceSchema,50,"աշխատանքային փորձ"),
     education: optionalArray(ResumeEducationSchema,40,"ուսումնական հաստատություն"),
     skills: optionalArray(ResumeSkillSchema,30,"հմտություն"),
     languages: optionalArray(ResumeSkillSchema,35,"լեզու"),
})

export const ResumeOptionalDetailsSchema = z.object({
     links: optionalArray(ResumeLinkSchema,50,"վեբ հղում"),
     courses: optionalArray(ResumeCourseSchema,40,"դասընթաց"),
     references: optionalArray(ResumeReferenceSchema,20,"կոնտակտային հղում"),
})

export const DocStyleSchema = z.object({
     colorHex: optionalString,
     borderStyle: z.custom<BorderStyles>().optional()
})

export const ResumeFormSchema = z.object({
     ...ResumeInfoSchema.shape,
     ...ResumeDetailsSchema.shape,
     ...ResumeOptionalDetailsSchema.shape,
     ...DocStyleSchema.shape
})

export const CreditCardSchema = z.object({
     cardNumber: z.string().regex(/^\d{16}$/, "Վարկային քարտը պետք է լինի մաքսիմում 16 նիշ").trim().refine(data=>isValidCard(data),"Մուտքագրեք վավերական վարկային քարտ"),
     expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Քարտի ժամկետը պետք է լինի MM/YY ֆորմատով").trim(),
     cvv: z.string().regex(/^\d{3,4}$/, "CVV-ն պետք է լինի 3-4 նիշ").trim(),
     cardName: z.string().min(1,"Պետք է նշել քարտի օգտատիրոջ անունը").trim(),
     city: z.string().min(1,"Նշել քաղաքը").trim()
})

export const CheckoutFormSchema = z.object({
     email: emailField.trim().transform(email => email.toLowerCase()),
     ...CreditCardSchema.shape
})

export const CoverLetterInfoSchema = z.object({
     title: optionalString,
     description: optionalString,
     fname: optionalString,
     lname: optionalString,
     jobTitle: optionalJobTitleString,
     phone: optionalString,
     address: optionalString,
     email: optionalEmailString,
     profileImg: fileField
})

export const CoverLetterDetailsSchema = z.object({
     recipientName: optionalString,
     recipientTitle: optionalString,
     companyName: optionalString,
     companyAddress: optionalString,
     letterContent: optionalString,
     letterDate: z.optional(z.date())
})

export const CoverLetterFormSchema = z.object({
     ...CoverLetterInfoSchema.shape,
     ...CoverLetterDetailsSchema.shape,
     ...DocStyleSchema.shape
})

export const CheckoutPageSearchSchema = z.object({
     plan: z.enum([UserPlan.free,UserPlan.premium]),
     planType: z.enum(["yearly","monthly"])
})

export const SettingsSchema = z.object({
     name: z.optional(z.string().trim()),
     email: z.optional(emailField.trim().transform(email => email.toLowerCase())),
     jobTitle: z.optional(jobTitleField.trim()),
     phone: z.optional(z.string().trim()),
     address: z.optional(z.string().trim()),
     summary: z.optional(z.string().trim()),
     hobbies: z.optional(z.string().trim()),
     password: z.optional(passwordField.trim()),
     newPassword: z.optional(passwordField.trim()),
     isTwoFactorEnabled: z.optional(z.boolean()),
     showEmail: z.optional(z.boolean()),
     showAddress: z.optional(z.boolean()),
     showPhone: z.optional(z.boolean()),
     showLinks: z.optional(z.boolean())
})
.refine(data=>{
     if(data.password && !data.newPassword){
          return false
     }
     return true;
},{
     message: "Պարտադիր է գրել նոր գաղտնաբառ",
     path: ["newPassword"]
})
.refine(data=>{
     if(data.newPassword && !data.password){
          return false;
     }
     return true
},{
     message: "Պարտադիր է գրել գաղտնաբառ",
     path: ["password"]
})