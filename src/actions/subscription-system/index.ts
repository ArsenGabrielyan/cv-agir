"use server"
import { getCurrentSubscription, getSubscriptionById } from "@/data/subscription";
import { getUserById } from "@/data/user";
import { parseExpiryDate } from "@/lib/helpers/credit-cards";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckoutFormSchema } from "@/schemas"
import { CheckoutFormType } from "@/lib/types/schema"
import { SubscriptionPeriod, UserPlan } from "@db";
import { revalidatePath } from "next/cache";
import { upsertCard } from "./credit-card";
import {cache} from "react"
import { ERROR_MESSAGES } from "@/lib/constants";
import { getIpAddress } from "@/actions/ip";
import { logAction } from "@/data/logs";

export const proceedToCheckout = async(values: CheckoutFormType, period: SubscriptionPeriod, price: number, plan: UserPlan) => {
     const currIp = await getIpAddress();
     const user = await currentUser();
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          return {error: ERROR_MESSAGES.auth.unauthorized}
     }
     const validatedFields = CheckoutFormSchema.safeParse(values);
     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(val=>val.path[0]),
               }
          })
          return {error: ERROR_MESSAGES.validationError}
     }
     const {email, cardNumber, expiryDate, cvv, cardName, city} = validatedFields.data;
     const existingUser = await db.user.findFirst({
          where: {
               email,
               id: user.id
          }
     });
     if(!existingUser){
          await logAction({
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.auth.noUserFound
               }
          })
          return {error: ERROR_MESSAGES.auth.noUserFound}
     }
     const expires = parseExpiryDate(expiryDate);
     if(expires.error){
          await logAction({
               userId: existingUser.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: expires.error
               }
          })
          return {error: expires.error}
     }
     if(expires.date){
          const endDate = new Date();
          if(period==="monthly"){
               endDate.setMonth(endDate.getMonth()+1);
          } else if(period==="yearly"){
               endDate.setFullYear(endDate.getFullYear()+1);
          }
          const currSubscription = await db.subscription.upsert({
               where: {
                    userId: existingUser.id
               },
               create: {
                    userId: existingUser.id,
                    plan,
                    period,
                    price,
                    endDate,
                    startDate: new Date()
               },
               update: {
                    plan,
                    period,
                    price,
                    endDate,
                    startDate: new Date()
               }
          })
          const creditCards = await upsertCard({cardName,cardNumber,city,cvv,expiryDate},user,expires.date);
          await db.user.update({
               where: {
                    email,
                    id: currSubscription.userId
               },
               data: {
                    currentPlan: currSubscription.plan,
                    subscriptionId: currSubscription.id,
                    creditCards
               }
          })
          await logAction({
               userId: existingUser.id,
               action: "PLAN_UPGRADED",
               metadata: { ip: currIp }
          })
          return {success: 'Խնդրում ենք սպասել․․․'}
     }
     await logAction({
          userId: existingUser.id,
          action: "ACTION_ERROR",
          metadata: {
               ip: currIp,
               reason: ERROR_MESSAGES.subscription.expiredCreditCard
          }
     })
     return {error: ERROR_MESSAGES.subscription.expiredCreditCard}
}

export const getSubscriptionLevel = cache(async(userId: string): Promise<UserPlan> => {
     const user = await getUserById(userId);
     const currIp = await getIpAddress();
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          throw new Error(ERROR_MESSAGES.auth.unauthorized)
     }
     if(!user.currentPlan){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.subscription.invalidPlan
               }
          })
          throw new Error(ERROR_MESSAGES.subscription.invalidPlan)
     }
     const subscription = user.subscriptionId ? await getCurrentSubscription(user.id,user.subscriptionId) : null
     if(!subscription){
          return "free"
     }
     const expired = new Date(subscription.endDate) < new Date();
     return expired ? "free" : user.currentPlan
})

export const cancelSubscription = async(userId: string) => {
     const user = await getUserById(userId);
     const currIp = await getIpAddress();
     if(!user){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          return {error: ERROR_MESSAGES.auth.unauthorized}
     }
     const subscription = user.subscriptionId ? await getSubscriptionById(user.subscriptionId) : null
     if(!subscription){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.auth.notSubscribed
               }
          })
          return {error: ERROR_MESSAGES.auth.notSubscribed}
     }
     await db.subscription.deleteMany({
          where: {
               userId: user.id
          }
     })
     await db.user.update({
          where: {id: user.id},
          data: {
               currentPlan: "free",
               subscriptionId: {
                    unset: true
               }
          }
     })
     await logAction({
          userId: user.id,
          action: "PLAN_CANCELLED",
          metadata: { ip: currIp }
     })
     revalidatePath("/settings?tab=subscription")
     return {success: true}
}

export const renewSubscription = async(userId: string) => {
     const user = await getUserById(userId);
     const currIp = await getIpAddress();
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp
               }
          })
          return {error: ERROR_MESSAGES.auth.unauthorized}
     }
     const subscription = user.subscriptionId ? await getSubscriptionById(user.subscriptionId) : null
     if(!subscription){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.auth.notSubscribed
               }
          })
          return {error: ERROR_MESSAGES.auth.notSubscribed}
     }
     const endDate = new Date();
     if(subscription.period==="monthly"){
          endDate.setMonth(endDate.getMonth()+1);
     } else if(subscription.period==="yearly"){
          endDate.setFullYear(endDate.getFullYear()+1);
     }
     const currSubscription = await db.subscription.update({
          where: {
               userId: user.id,
               id: user.subscriptionId || ''
          },
          data: {
               endDate,
               startDate: new Date()
          }
     })
     await db.user.update({
          where: {
               id: currSubscription.userId
          },
          data: {
               currentPlan: "premium",
               subscriptionId: currSubscription.id
          }
     })
     await logAction({
          userId: user.id,
          action: "PLAN_RENEWED",
          metadata: { ip: currIp }
     })
     revalidatePath("/settings?tab=subscription")
     return {success: true}
}