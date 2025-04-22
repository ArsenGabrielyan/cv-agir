import * as z from "zod"

export function optionalArray<T>(arr: z.ZodType<T>,maxCount?: number,itemName?: string){
     return (maxCount && itemName) ? z.optional(z.array(arr).max(maxCount,`${maxCount}-ից ավել ${itemName.toLowerCase()} ավելացնել չի կարելի`)) : z.optional(z.array(arr))
}
export const zDescField = (name = "Նկարագրություն") => z.string().min(20,`${name}ը պետք է լինի առնվազն 20 նիշ`).max(1000,`${name}ը շատ երկար է`)
export const emailField = z.string().email("Մուտքագրեք վավերական էլ․ հասցե").max(254, "Էլ․ հասցեն շատ երկար է")
export const passwordField = z.string().min(8,"Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ").max(64, "Գաղտնաբառը շատ երկար է")
export const jobTitleField = z.string().max(100,"Մասնագիտությունը շատ երկար է")
export const descriptionField = zDescField();
export const nameField = z.string().min(2,"Անունը և ազգանունը շատ կարճ է").max(100,"Անունը և ազգանունը շատ երկար է")
export const fileField = z.instanceof(File, { message: "Պետք է լինի նկար" })
.refine((file) => !file || file.type.startsWith("image/"),"Ֆայլի տեսակը պետք է լինի նկարի (.png, .jpg և այլն)")
.refine((file) => !file || file.size > 0, "Ֆայլը դատարկ է")
.refine((file) => !file || file.size <= 4 * 1024 * 1024, "Նկարը պետք է լինի մինչև 4 ՄԲ")
.nullable().optional()
export const optionalString = z.optional(z.string().trim().max(300,"Այս տեքստը շատ երկար է")).or(z.literal(""))
export const optionalEmailString = z.optional(emailField.trim().transform(email => email.toLowerCase())).or(z.literal(""))
export const optionalJobTitleString = z.optional(jobTitleField.trim()).or(z.literal(""))
export const optionalDescString = z.optional(zDescField().trim()).or(z.literal(""))