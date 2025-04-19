import * as z from "zod"
import {
     ResumeLinkSchema,
     WorkExperienceSchema,
     ResumeEducationSchema,
     ResumeCourseSchema,
     ResumeReferenceSchema,
     ResumeSkillSchema,
     optionalEmailString,
     optionalString,
} from "./resume"
import {BorderStyles} from "@db/"
import { isValidCard } from "@/data/helpers"

function optionalArray<T>(arr: z.ZodType<T>){
     return z.optional(z.array(arr))
}

export const ResetSchema = z.object({
     email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
})

export const NewPasswordSchema = z.object({
     password: z.string().min(8,"Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")
})

export const LoginSchema = z.object({
     email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
     password: z.string().min(1,"Մուտքագրեք գաղտնաբառը մուտք գործելու համար"),
     code: z.optional(z.string())
})

export const RegisterSchema = z.object({
     name: z.string().min(2,"Մուտքագրեք Ձեր անունը և ազգանունը").max(100,"Անունը և ազգանունը շատ երկար է"),
     email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
     password: z.string().min(8,"Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")
})

export const ContactSchema = z.object({
     name: z.string().min(2,"Անունը և ազգանունը պետք է ունենա առնվազն 2 տառ").max(100,"Անունը և ազգանունը շատ երկար է"),
     email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
     phone: z.string().regex(/^[0-9+() -]*$/,"Հեռախոսահամարը պետք է պարունակի միայն թվեր և նշաններ (+, -, (, ))").min(8, "Հեռախոսահամարը շատ կարճ է").max(20, "Հեռախոսահամարը շատ երկար է"),
     subject: z.string().min(1,"Մուտքագրեք հաղորդագրության թեմայի անունը").max(100, "Թեման շատ երկար է"),
     message: z.string().min(5, "Հաղորդագրությունը պետք է լինի առնվազն 5 տառ")
})

export const ResumeInfoSchema = z.object({
     title: optionalString,
     description: optionalString,
     fname: optionalString,
     lname: optionalString,
     jobTitle: optionalString,
     phone: optionalString,
     address: optionalString,
     email: optionalEmailString,
     summary: optionalString,
     hobbies: optionalString,
     profileImg: z
     .instanceof(File, { message: "Պետք է լինի նկար" })
     .refine((file) => !file || file.type.startsWith("image/"), {
       message: "Ֆայլի տեսակը պետք է լինի նկարի (.png, .jpg և այլն)",
     })
     .refine((file) => !file || file.size <= 4 * 1024 * 1024, {
       message: "Նկարը պետք է լինի մինչև 4 ՄԲ",
     })
     .nullable()
     .optional(),
})

export const ResumeDetailsSchema = z.object({
     experience: optionalArray(WorkExperienceSchema),
     education: optionalArray(ResumeEducationSchema),
     skills: optionalArray(ResumeSkillSchema),
     languages: optionalArray(ResumeSkillSchema),
})

export const ResumeOptionalDetailsSchema = z.object({
     links: optionalArray(ResumeLinkSchema),
     courses: optionalArray(ResumeCourseSchema),
     references: optionalArray(ResumeReferenceSchema),
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
     cardNumber: z.string().regex(/^\d{16}$/, "Վարկային քարտը պետք է լինի մաքսիմում 16 նիշ").refine(data=>isValidCard(data),"Մուտքագրեք վավերական վարկային քարտ"),
     expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Քարտի ժամկետը պետք է լինի MM/YY ֆորմատով"),
     cvv: z.string().regex(/^\d{3,4}$/, "CVV-ն պետք է լինի 3-4 նիշ"),
     cardName: z.string().min(1,"Պետք է նշել քարտի օգտատիրոջ անունը"),
     city: z.string().min(1,"Նշել քաղաքը")
})

export const CheckoutFormSchema = z.object({
     email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
     ...CreditCardSchema.shape
})

export const CoverLetterInfoSchema = z.object({
     title: optionalString,
     description: optionalString,
     fname: optionalString,
     lname: optionalString,
     jobTitle: optionalString,
     phone: optionalString,
     address: optionalString,
     email: optionalEmailString,
     profileImg: z.custom<File | undefined>()
     .refine(
       (file) =>
         !file || (file instanceof File && file.type.startsWith("image/")),
       "Պետք է լինի նկար",
     )
     .refine(
       (file) => !file || file.size <= 1024 * 1024 * 4,
       "Նկարը պետք է լինի ավելի քիչ քան 4ՄԲ",
     ),
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