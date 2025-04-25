"use server"
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/db/user";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth";
import { getTwoFactorTokenByEmail } from "@/data/db/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/db/two-factor-confirmation";
import { logAction } from "@/data/db/logs";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { LoginType } from "@/data/types/schema";
import { checkLimiter, getIpAddress } from "@/lib/limiter";
import { ERROR_MESSAGES } from "@/data/constants";

const authErrorMessages: Record<AuthError["name"], string> = {
     CredentialsSignin: "Սխալ էլ․ փոստ կամ գաղտնաբառ։",
     AccessDenied: "Դուք չեք կարող մուտք գործել։",
     Configuration: "Սխալ կոնֆիգուրացիա։",
     Verification: "Ստուգման սխալ։",
     OAuthSignin: "OAuth մուտք գործելու սխալ։",
     OAuthCallback: "OAuth-ի հետ կանչման սխալ։",
     OAuthCreateAccount: "OAuth հաշվի ստեղծման սխալ։",
     EmailCreateAccount: "Էլ․ փոստի հաշվին ստեղծման սխալ։",
     Callback: "Հետ կանչման սխալ։",
     OAuthAccountNotLinked: "Այս էլ․ փոստով արդեն կա հաշիվ, բայց այլ մուտքի մեթոդով։",
     SessionRequired: "Խնդրում ենք մուտք գործել՝ այս էջը դիտելու համար։",
     Default: "Մի բան սխալ տեղի ունեցավ։",
};

export const login = async (
     values: LoginType,
     callbackUrl?: string | null
) => {
     const currIp = await getIpAddress();
     const validatedFields = LoginSchema.safeParse(values);

     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(issue => issue.path[0]),
               }
          })
          return {error: ERROR_MESSAGES.validationError}
     }

     const {email,password, code} = validatedFields.data;
     const limiterKey = `login:${email}`;

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
     const isSamePass = await bcrypt.compare(password,existingUser?.password || "");

     if(!existingUser || !existingUser.email || !existingUser.password || !existingUser.name){
          await logAction({
               action: "LOGIN_ERROR",
               metadata: {
                    email,
                    ip: currIp,
                    reason: ERROR_MESSAGES.auth.noUserFound
               }
          })
          return {error: ERROR_MESSAGES.auth.noUserFound}
     }

     if(!existingUser.emailVerified) {
          const verificationToken = await generateVerificationToken(email);
          await sendVerificationEmail(
               existingUser.name,
               verificationToken.email,
               verificationToken.token
          )
          await logAction({
               userId: existingUser.id,
               action: "VERIFICATION_REQUEST",
               metadata: { email }
          })
          return {success: "Հաստատեք Ձեր Էլ․ Հասցեն"}
     }

     if(existingUser.isTwoFactorEnabled && existingUser.email && isSamePass){
          if(code){
               const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
               if(!twoFactorToken || twoFactorToken.token!==code){
                    await logAction({
                         userId: existingUser.id,
                         action: "FAILED_2FA_ATTEMPT",
                         metadata: {
                              email,
                              ip: currIp,
                              reason: ERROR_MESSAGES.auth.wrong2FAcode
                         }
                    })
                    return {error: ERROR_MESSAGES.auth.wrong2FAcode}
               }

               const hasExpired = new Date(twoFactorToken.expires) < new Date();
               if(hasExpired){
                    await logAction({
                         userId: existingUser.id,
                         action: "FAILED_2FA_ATTEMPT",
                         metadata: {
                              email,
                              ip: currIp,
                              reason: ERROR_MESSAGES.auth.expired2FAcode
                         }
                    })
                    return {error: ERROR_MESSAGES.auth.expired2FAcode}
               }

               await db.twoFactorToken.delete({
                    where: {
                         id: twoFactorToken.id
                    }
               })

               const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
               if(existingConfirmation){
                    await db.twoFactorConfirmation.delete({
                         where: {
                              id: existingConfirmation.id
                         }
                    })
               }

               await db.twoFactorConfirmation.create({
                    data: {
                         userId: existingUser.id
                    }
               })
               await logAction({
                    userId: existingUser.id,
                    action: "TWO_FACTOR_VERIFIED",
                    metadata: {
                         ip: currIp,
                         email: existingUser.email
                    }
               })
          } else {
               const twoFactorToken = await generateTwoFactorToken(existingUser.email);
               await sendTwoFactorEmail(
                    existingUser.name,
                    twoFactorToken.email,
                    twoFactorToken.token
               )
               return {twoFactor: true}
          }
     }

     try{
          await signIn("credentials",{
               email,
               password,
               redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
          })
     } catch(error: unknown){
          if (error instanceof AuthError){
               await logAction({
                    userId: existingUser.id,
                    action: "LOGIN_ERROR",
                    metadata: {
                         email,
                         ip: currIp,
                         reason: authErrorMessages[error.name] || authErrorMessages.Default
                    }
               })
               return {error: authErrorMessages[error.name] || authErrorMessages.Default}
          }
          throw error
     }
}