import * as z from "zod"
import { emailField, jobTitleField, passwordField } from "./fields";

export const AccountSettingsSchema = z.object({
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