"use server"
import { RegisterSchema } from "@/schemas"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/db/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { RegisterFormType } from "@/data/types/schema"
import { checkLimiter, clearLimiter, incrementLimiter } from "@/lib/limiter"

export const register = async (values: RegisterFormType) => {
     const validatedFields = RegisterSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացված չեն"}
     }
     const {email,password,name} = validatedFields.data;
     const limiterKey = `register:${email}`;

     if(checkLimiter(limiterKey,5)) {
          return {error: "Շատ հաճախ եք փորձում։ Խնդրում ենք փորձել ավելի ուշ"}
     }

     const existingUser = await getUserByEmail(email);
     if(existingUser){
          incrementLimiter(limiterKey,60*60_000)
          return {error: "Էլ․ հասցեն արդեն օգտագործված է"}
     }
     const hashedPassword = await bcrypt.hash(password,10);

     await db.user.create({
          data: {
               name,
               email: email.trim().toLowerCase(),
               password: hashedPassword,
               cvPageSettings: {
                    showEmail: true,
                    showAddress: true,
                    showLinks: true,
                    showPhone: true
               }
          }
     })
     clearLimiter(limiterKey)
     
     const verificationToken = await generateVerificationToken(email);
     await sendVerificationEmail(name,verificationToken.email,verificationToken.token)

     return {success: "Միայն մեկ քայլ է մնացել՝ հաստատեք Ձեր էլ․ փոստը"}
}