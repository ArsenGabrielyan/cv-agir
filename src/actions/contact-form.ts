"use server"
import { sendMessage } from "@/lib/mail";
import { ContactSchema } from "@/schemas"
import { ContactFormType } from "@/schemas/types";

export const submitContactForm = async (values: ContactFormType) => {
     const validatedFields = ContactSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացված չեն"}
     }

     const {name,email,phone,subject,message} = validatedFields.data

     await sendMessage(name,email,phone,subject,message);

     return {success: "Հաղորդագրությունը ուղարկված է!"}
}