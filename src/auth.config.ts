import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/db/user"
import bcrypt from "bcryptjs"
import { env } from "@/lib/env"
import { clearLimiter, getIpAddress, incrementLimiter } from "./lib/limiter"
import { logAction } from "@/data/db/logs"
import { ERROR_MESSAGES } from "./data/constants"

export default { 
     providers: [
          Credentials({
               async authorize(credentials) {
                    const validatedFields = LoginSchema.safeParse(credentials)
                    const currIp = await getIpAddress()

                    if(validatedFields.success){
                         const {email, password} = validatedFields.data;
                         const limiterKey = `login:${email}`;
                         const user = await getUserByEmail(email);
                         if(!user || !user.password){
                              await logAction({
                                   action: "LOGIN_ERROR",
                                   metadata: {
                                        email,
                                        ip: currIp,
                                        reason: ERROR_MESSAGES.auth.noUserFound
                                   }
                              })
                              return null;
                         }
                         const passwordsMatch = await bcrypt.compare(password,user.password);
                         if(!passwordsMatch){
                              incrementLimiter(limiterKey,60_000)
                              return null
                         }
                         clearLimiter(limiterKey)
                         return user;
                    }

                    return null
               }
          }),
          Github({
               clientId: env.GITHUB_ID,
               clientSecret: env.GITHUB_SECRET
          }),
          Google({
               clientId: env.GOOGLE_ID,
               clientSecret: env.GOOGLE_SECRET,
               profile: (profile) => ({
                    ...profile,
                    id: profile.sub,
                    image: profile.picture,
               })
          }),
          Facebook({
               clientId: env.FACEBOOK_ID,
               clientSecret: env.FACEBOOK_SECRET
          })
     ]
} satisfies NextAuthConfig