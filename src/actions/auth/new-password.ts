"use server"
import { NewPasswordSchema } from "@/schemas"
import { db } from "@/lib/db"
import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user"
import bcrypt from "bcryptjs"
import { NewPasswordType } from "@/lib/types/schema"
import { checkLimiter, clearLimiter, incrementLimiter } from "@/lib/limiter"
import { logAction } from "@/data/logs"
import { ERROR_MESSAGES } from "@/lib/constants"
import { getIpAddress } from "../ip"

export const newPassword = async(
     values: NewPasswordType,
     token: string | null
) => {
     const currIp = await getIpAddress();
     if(!token){
          await logAction({
               action: "PASSWORD_CHANGE_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.auth.noPassResetToken
               }
          })
          return {error: ERROR_MESSAGES.auth.noPassResetToken}
     }

     const validatedFields = NewPasswordSchema.safeParse(values);

     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(issue => issue.path[0]),
               }
          })
          return {error: ERROR_MESSAGES.validationError}
     }
     const limiterKey = `new-password:${await getIpAddress()}`;
     if(checkLimiter(limiterKey,5)){
          await logAction({
               action: "RATE_LIMIT_EXCEEDED",
               metadata: {
                    ip: currIp,
                    route: limiterKey
               }
          })
          return {error: ERROR_MESSAGES.rateLimitError}
     }

     const {password} = validatedFields.data
     
     const existingToken = await getPasswordResetTokenByToken(token);
     if(!existingToken){
          incrementLimiter(limiterKey,60*60_000)
          await logAction({
               action: "PASSWORD_CHANGE_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.auth.wrongPassResetToken
               }
          })
          return {error: ERROR_MESSAGES.auth.wrongPassResetToken}
     }

     const hasExpired = new Date(existingToken.expires) < new Date();
     if(hasExpired){
          incrementLimiter(limiterKey,60*60_000)
          await logAction({
               action: "PASSWORD_CHANGE_ERROR",
               metadata: {
                    email: existingToken.email,
                    ip: currIp,
                    reason: ERROR_MESSAGES.auth.expiredPassResetToken
               }
          })
          return {error: ERROR_MESSAGES.auth.expiredPassResetToken}
     }

     const existingUser = await getUserByEmail(existingToken.email);
     if(!existingUser || !existingUser.password){
          incrementLimiter(limiterKey,60*60_000)
          await logAction({
               action: "PASSWORD_CHANGE_ERROR",
               metadata: {
                    email: existingToken.email,
                    ip: currIp,
                    reason: ERROR_MESSAGES.auth.noUserFound
               }
          })
          return {error: ERROR_MESSAGES.auth.noUserFound}
     }

     const isSamePassword = await bcrypt.compare(password,existingUser.password);
     if(isSamePassword){
          incrementLimiter(limiterKey,60*60_000)
          await logAction({
               userId: existingUser.id,
               action: "PASSWORD_CHANGE_ERROR",
               metadata: {
                    email: existingToken.email,
                    ip: currIp,
                    reason: ERROR_MESSAGES.auth.wrongNewPassword
               }
          })
          return {error: ERROR_MESSAGES.auth.wrongNewPassword}
     }

     clearLimiter(limiterKey)
     const hashedPassword = await bcrypt.hash(password,10);

     await db.user.update({
          where: {
               id: existingUser.id
          },
          data: {
               password: hashedPassword
          }
     })
     await db.passwordResetToken.delete({
          where: {
               id: existingToken.id
          }
     })

     await logAction({
          userId: existingUser.id,
          action: "PASSWORD_CHANGED",
          metadata: {
               ip: currIp,
               email: existingUser.email || "Անհայտ էլ․ հասցե"
          }
     })

     return {success: "Գաղտնաբառը թարմացված է"}
}