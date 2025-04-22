import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/db/user"
import bcrypt from "bcryptjs"
import { env } from "@/lib/env"
import { clearLimiter, incrementLimiter } from "./lib/limiter"

export default { 
     providers: [
          Credentials({
               async authorize(credentials) {
                    const validatedFields = LoginSchema.safeParse(credentials)

                    if(validatedFields.success){
                         const {email, password} = validatedFields.data;
                         const limiterKey = `login:${email}`;
                         const user = await getUserByEmail(email);
                         if(!user || !user.password) return null;

                         const passwordsMatch = await bcrypt.compare(password,user.password);

                         if(passwordsMatch) {
                              clearLimiter(limiterKey)
                              return user;
                         } else {
                              incrementLimiter(limiterKey,60_000)
                              return null
                         }
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
          }),
          Facebook({
               clientId: env.FACEBOOK_ID,
               clientSecret: env.FACEBOOK_SECRET
          })
     ]
} satisfies NextAuthConfig