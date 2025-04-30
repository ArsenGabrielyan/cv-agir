import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { getUserById } from "@/data/db/user"
import { getTwoFactorConfirmationByUserId } from "@/data/db/two-factor-confirmation"
import { getAccountByUserId } from "@/data/db/account"
import { CreditCard, CVPageSettings, UserPlan } from "@db"
import { getSubscriptionById } from "@/data/db/subscription"
import { CustomPrismaAdapter } from "@/lib/auth/prisma-adapter"
import { getIpAddress } from "./lib/limiter"
import { logAction } from "./data/db/logs"
import { ERROR_MESSAGES } from "./data/constants"

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({user, account}){
      await db.user.update({
        where: {id: user.id},
        data: {
          emailVerified: new Date()
        }
      })
      await logAction({
        userId: user.id,
        action: "OAUTH_SIGNIN",
        metadata: {
          email: user.email || "Անհայտ էլ․ հասցե",
          provider: account.provider
        }
      })
    }
  },
  callbacks: {
    async signIn({user, account}){
      const currIp = await getIpAddress();
      // Allow OAuth Without Email Verification
      if(account?.provider!=="credentials"){
        await logAction({
          userId: user.id,
          action: "LOGIN_SUCCESS",
          metadata: {
            email: user.email || "Անհայտ էլ․ հասցե",
            ip: currIp,
          }
        })
        return true;
      } 

      const existingUser = await getUserById(user.id as string)

      // Prevent Sign In Without a Verification
      if(!existingUser?.emailVerified){
        await logAction({
          userId: existingUser?.id,
          action: "LOGIN_ERROR",
          metadata: {
            email: user.email || "Անհայտ էլ․ հասցե",
            ip: currIp,
            reason: ERROR_MESSAGES.auth.notVerified
          }
        })
        return false
      }

      if(existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if(!twoFactorConfirmation){
          await logAction({
            userId: existingUser?.id,
            action: "FAILED_2FA_ATTEMPT",
            metadata: {
              email: user.email || "Անհայտ էլ․ հասցե",
              ip: currIp,
              reason: ERROR_MESSAGES.auth.failed2FA
            }
          })
          return false;
        }

        // Delete 2FA Confimration For Next Sign In
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          }
        })
      }
      await logAction({
        userId: user.id,
        action: "LOGIN_SUCCESS",
        metadata: {
          email: user.email || "Անհայտ էլ․ հասցե",
          ip: currIp,
        }
      })
      return true;
    },
    async session({ token, session }){
      if(token.sub && session.user){
        session.user.id = token.sub
      }

      if(token.isTwoFactorEnabled && session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      if(session.user){
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOauth = token.isOauth as boolean;
        session.user.jobTitle = token.jobTitle as string;
        session.user.phone = token.phone as string;
        session.user.address = token.address as string
        session.user.summary = token.summary as string
        session.user.hobbies = token.hobbies as string
        session.user.currentPlan = token.currentPlan as UserPlan
        session.user.subscriptionId = token.subscriptionId as string
        session.user.creditCards = token.creditCards as CreditCard[]
        session.user.cvPageSettings = token.cvPageSettings as CVPageSettings
      }

      if(token.subscriptionEndDate && session.user){
        session.user.subscriptionEndDate = token.subscriptionEndDate as Date
      }

      return session
    },
    async jwt({token}){
      if(!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if(!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      const existingSubscription = existingUser.subscriptionId ? await getSubscriptionById(existingUser.subscriptionId) : null

      token.isOauth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.jobTitle = existingUser.jobTitle
      token.phone = existingUser.phone
      token.address = existingUser.address
      token.summary = existingUser.summary
      token.hobbies = existingUser.hobbies
      token.currentPlan = existingUser.currentPlan
      token.subscriptionId = existingUser.subscriptionId
      token.creditCards = existingUser.creditCards
      token.cvPageSettings = existingUser.cvPageSettings

      if(existingSubscription){
        token.subscriptionEndDate = existingSubscription.endDate
      }

      return token
    }
  },
  adapter: CustomPrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 3*24*60*60,
  },
  debug: process.env.NODE_ENV!=="production",
  ...authConfig,
})