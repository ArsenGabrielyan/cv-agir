"use server"
import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetPassType } from "@/lib/types/schema"
import { checkLimiter, clearLimiter, incrementLimiter } from "@/lib/limiter"
import { logAction } from "@/data/logs"
import { ERROR_MESSAGES } from "@/lib/constants"
import { getIpAddress } from "../ip"

export const reset = async (values: ResetPassType) => {
     const currIp = await getIpAddress();
     const validatedFields = ResetSchema.safeParse(values);

     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(issue => issue.path[0]),
               }
          })
          return {error: ERROR_MESSAGES.auth.invalidEmail}
     }
     const {email} = validatedFields.data;
     const limiterKey = `reset:${email}`

     if(checkLimiter(limiterKey,3)){
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
     if(!existingUser || !existingUser.name){
          incrementLimiter(limiterKey, 60 * 60_000);
          await logAction({
               action: "PASSWORD_CHANGE_ERROR",
               metadata: {
                    ip: currIp,
                    email,
                    reason: ERROR_MESSAGES.auth.noUserFound
               }
          })
          return {error: ERROR_MESSAGES.auth.noUserFound}
     }

     clearLimiter(limiterKey)

     const passwordResetToken = await generatePasswordResetToken(email);
     await sendPasswordResetEmail(
          existingUser.name,
          passwordResetToken.email,
          passwordResetToken.token
     )
     await logAction({
          userId: existingUser.id,
          action: "PASSWORD_CHANGE_REQUEST",
          metadata: {
               email: existingUser.email || "Անհայտ էլ․ հասցե"
          }
     })
     return {success: "Վերականգման հղումը ուղարկված է։"}
}