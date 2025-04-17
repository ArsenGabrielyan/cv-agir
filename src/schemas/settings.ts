import * as z from "zod"

export const AccountSettingsSchema = z.object({
     name: z.optional(z.string()),
     email: z.optional(z.string().email("Մուտքագրեք վավերական էլ․ փոստ")),
     jobTitle: z.optional(z.string()),
     phone: z.optional(z.string()),
     address: z.optional(z.string()),
     summary: z.optional(z.string()),
     hobbies: z.optional(z.string()),
     password: z.optional(z.string().min(8,"Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")),
     newPassword: z.optional(z.string().min(8,"Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")),
     isTwoFactorEnabled: z.optional(z.boolean())
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