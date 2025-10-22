"use server"
import { ERROR_MESSAGES } from "@/lib/constants"
import { logAction } from "@/data/logs"
import { getUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db"
import { getIpAddress } from "@/lib/limiter"

export const newVerification = async (token: string) => {
     const currIp = await getIpAddress()
     const existingToken = await getVerificationTokenByToken(token);
     if(!existingToken){
          await logAction({
               action: "VERIFICATION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.auth.noVerificationToken
               }
          })
          return {error: ERROR_MESSAGES.auth.noVerificationToken}
     }

     const hasExpired = new Date(existingToken.expires) < new Date();
     if(hasExpired){
          await logAction({
               action: "VERIFICATION_ERROR",
               metadata: {
                    ip: currIp,
                    email: existingToken.email,
                    reason: ERROR_MESSAGES.auth.expiredVerificationToken
               }
          })
          return {error: ERROR_MESSAGES.auth.expiredVerificationToken}
     }

     const existingUser = await getUserByEmail(existingToken.email);
     if(!existingUser){
          await logAction({
               action: "VERIFICATION_ERROR",
               metadata: {
                    ip: currIp,
                    email: existingToken.email,
                    reason: ERROR_MESSAGES.auth.noUserFound
               }
          })
          return {error: ERROR_MESSAGES.auth.noUserFound}
     }

     await db.user.update({
          where: {
               id: existingUser.id
          },
          data: {
               emailVerified: new Date(),
               email: existingToken.email
          }
     })
     await db.verificationToken.delete({
          where: {
               id: existingToken.id
          }
     })
     await logAction({
          userId: existingUser.id,
          action: "EMAIL_VERIFIED",
          metadata: { email: existingUser.email || "Անհայտ էլ․ հասցե" }
     })
     return {success: "Ձեր էլ․ փոստը հաջողությամբ հաստատվել է։"}
}