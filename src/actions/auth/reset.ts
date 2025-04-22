"use server"
import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/db/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetPassType } from "@/data/types/schema"
import { checkLimiter, clearLimiter, incrementLimiter } from "@/lib/limiter"

export const reset = async (values: ResetPassType) => {
     const validatedFields = ResetSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Էլ․ հասցեն վալիդացված չէ։"}
     }
     const {email} = validatedFields.data;
     const limiterKey = `reset:${email}`

     if(checkLimiter(limiterKey,3)){
          return {error: "Շատ հաճախ եք փորձում։ Խնդրում ենք փորձել ավելի ուշ"}
     }

     const existingUser = await getUserByEmail(email);
     if(!existingUser || !existingUser.name){
          incrementLimiter(limiterKey, 60 * 60_000);
          return {error: "Այս էլ․ հասցեն գրանցված չէ։"}
     }

     clearLimiter(limiterKey)

     const passwordResetToken = await generatePasswordResetToken(email);
     await sendPasswordResetEmail(
          existingUser.name,
          passwordResetToken.email,
          passwordResetToken.token
     )

     return {success: "Վերականգման հղումը ուղարկված է։"}
}