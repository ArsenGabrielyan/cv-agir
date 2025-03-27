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
import { BorderStyles } from "@/app/(protected)/editor/style-buttons/border-style-button"

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

export const ResumeStyleSchema = z.object({
     colorHex: optionalString,
     borderStyle: z.custom<BorderStyles>().optional()
})

export const ResumeFormSchema = z.object({
     ...ResumeInfoSchema.shape,
     ...ResumeDetailsSchema.shape,
     ...ResumeOptionalDetailsSchema.shape,
     ...ResumeStyleSchema.shape
})