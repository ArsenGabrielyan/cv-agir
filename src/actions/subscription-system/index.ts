"use server"
import { getCurrentSubscription, getSubscriptionById } from "@/data/subscription";
import { getUserById } from "@/data/user";
import { parseExpiryDate } from "@/lib/helpers/credit-cards";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCheckoutFormSchema } from "@/schemas"
import { CheckoutFormType } from "@/schemas/types"
import { SubscriptionPeriod, UserPlan } from "@db";
import { revalidatePath } from "next/cache";
import {cache} from "react"
import { getIpAddress } from "@/actions/ip";
import { logAction } from "@/data/logs";
import { getTranslations } from "next-intl/server";
import { encryptData } from "../encryption";

export const proceedToCheckout = async(values: CheckoutFormType, period: SubscriptionPeriod, price: number, plan: UserPlan) => {
     const currIp = await getIpAddress();
     const user = await currentUser();
     const errMsg = await getTranslations("error-messages");
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          return {error: errMsg("auth.unauthorized")}
     }
     const validationMsg = await getTranslations("validations");
     const validatedFields = getCheckoutFormSchema(validationMsg).safeParse(values);
     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(val=>val.path[0]),
               }
          })
          return {error: errMsg("validationError")}
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
                    reason: errMsg("auth.noUserFound")
               }
          })
          return {error: errMsg("auth.noUserFound")}
     }
     const expires = parseExpiryDate(expiryDate,errMsg);
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
          await db.user.update({
               where: {
                    email,
                    id: currSubscription.userId
               },
               data: {
                    currentPlan: currSubscription.plan,
                    subscriptionId: currSubscription.id,
                    creditCards: {
                         deleteMany: {},
                         create: {
                              cardNumber: await encryptData(cardNumber),
                              cvv: await encryptData(cvv),
                              expiryDate: expires.date,
                              fullName: cardName,
                              city
                         }
                    }
               }
          })
          const buttonTxt = await getTranslations("buttons")
          await logAction({
               userId: existingUser.id,
               action: "PLAN_UPGRADED",
               metadata: { ip: currIp }
          })
          return {success: buttonTxt("loading")}
     }
     await logAction({
          userId: existingUser.id,
          action: "ACTION_ERROR",
          metadata: {
               ip: currIp,
               reason: errMsg("subscription.expiredCreditCard")
          }
     })
     return {error: errMsg("subscription.expiredCreditCard")}
}

export const getSubscriptionLevel = cache(async(userId: string): Promise<UserPlan> => {
     const user = await getUserById(userId);
     const currIp = await getIpAddress();
     const errMsg = await getTranslations("error-messages");
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          throw new Error(errMsg("auth.unauthorized"))
     }
     if(!user.currentPlan){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: errMsg("subscription.invalidPlan")
               }
          })
          throw new Error(errMsg("subscription.invalidPlan"))
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
     const errMsg = await getTranslations("error-messages");
     if(!user){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          return {error: errMsg("auth.unauthorized")}
     }
     const subscription = user.subscriptionId ? await getSubscriptionById(user.subscriptionId) : null
     if(!subscription){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: errMsg("auth.notSubscribed")
               }
          })
          return {error: errMsg("auth.notSubscribed")}
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
               subscriptionId: null
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
     const errMsg = await getTranslations("error-messages");
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp
               }
          })
          return {error: errMsg("auth.unauthorized")}
     }
     const subscription = user.subscriptionId ? await getSubscriptionById(user.subscriptionId) : null
     if(!subscription){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: errMsg("auth.notSubscribed")
               }
          })
          return {error: errMsg("auth.notSubscribed")}
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