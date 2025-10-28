"use server"
import { getRegisterSchema } from "@/schemas"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { RegisterFormType } from "@/schemas/types"
import { checkLimiter, clearLimiter, incrementLimiter } from "@/lib/limiter"
import { logAction } from "@/data/logs"
import { ERROR_MESSAGES } from "@/lib/constants"
import { getIpAddress } from "../ip"
import { getTranslations } from "next-intl/server"

export const register = async (values: RegisterFormType) => {
     const currIp = await getIpAddress();
     const validationMsg = await getTranslations("validations");
     const validatedFields = getRegisterSchema(validationMsg).safeParse(values);

     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(issue => issue.path[0]),
               }
          })
          return {error: ERROR_MESSAGES.validationError}
     }
     const {email,password,name} = validatedFields.data;
     const limiterKey = `register:${email}`;

     if(checkLimiter(limiterKey,5)) {
          await logAction({
               action: "RATE_LIMIT_EXCEEDED",
               metadata: {
                    ip: currIp,
                    route: limiterKey
               }
          })
          return {error: ERROR_MESSAGES.rateLimitError}
     }

     const existingUser = await getUserByEmail(email);
     if(existingUser){
          incrementLimiter(limiterKey,60*60_000);
          await logAction({
               action: "REGISTRATION_ERROR",
               metadata: {
                    ip: currIp,
                    email,
                    reason: ERROR_MESSAGES.auth.takenEmail
               }
          })
          return {error: ERROR_MESSAGES.auth.takenEmail}
     }
     const hashedPassword = await bcrypt.hash(password,10);

     const user = await db.user.create({
          data: {
               name,
               email: email.trim().toLowerCase(),
               password: hashedPassword,
               cvPageSettings: {
                    create: {
                         showEmail: true,
                         showAddress: true,
                         showLinks: true,
                         showPhone: true
                    }
               }
          }
     })
     clearLimiter(limiterKey)
     
     const verificationToken = await generateVerificationToken(email);
     await sendVerificationEmail(name,verificationToken.email,verificationToken.token)
     await logAction({
          userId: user.id,
          action: "USER_REGISTERED",
          metadata: {
               ip: currIp,
               email: user.email || "Անհայտ էլ․ հասցե"
          }
     })
     return {success: "Միայն մեկ քայլ է մնացել՝ հաստատեք Ձեր էլ․ փոստը"}
}