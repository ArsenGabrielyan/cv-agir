"use server"
import { RegisterSchema } from "@/schemas"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/db/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { RegisterFormType } from "@/schemas/types"

export const register = async (values: RegisterFormType) => {
     const validatedFields = RegisterSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացված չեն"}
     }
     const {email,password,name} = validatedFields.data;
     const hashedPassword = await bcrypt.hash(password,10);
     const existingUser = await getUserByEmail(email);
     if(existingUser){
          return {error: "Էլ․ հասցեն արդեն օգտագործված է"}
     }

     await db.user.create({
          data: {
               name,
               email,
               password: hashedPassword
          }
     })
     
     const verificationToken = await generateVerificationToken(email);
     await sendVerificationEmail(name,verificationToken.email,verificationToken.token)

     return {success: "Միայն մեկ քայլ է մնացել՝ հաստատեք Ձեր էլ․ փոստը"}
}