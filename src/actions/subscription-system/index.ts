"use server"
import { getCurrentSubscription, getSubscriptionById } from "@/data/db/subscription";
import { getUserById } from "@/data/db/user";
import { parseExpiryDate } from "@/data/helpers";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckoutFormSchema } from "@/schemas"
import { CheckoutFormType } from "@/data/types/schema"
import { SubscriptionPeriod, UserPlan } from "@db";
import { revalidatePath } from "next/cache";
import { upsertCard } from "./credit-card";
import {cache} from "react"

export const proceedToCheckout = async(values: CheckoutFormType, period: SubscriptionPeriod, price: number, plan: UserPlan) => {
     const user = await currentUser();
     if(!user || !user.id){
          return {error: "Այս օգտատերը նույնականացված չէ"}
     }
     const validatedFields = CheckoutFormSchema.safeParse(values);
     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վավերական չեն"}
     }
     const {email, cardNumber, expiryDate, cvv, cardName, city} = validatedFields.data;
     const existingUser = await db.user.findFirst({
          where: {
               email,
               id: user.id
          }
     });
     if(!existingUser){
          return {error: 'Այս օգտատերը գրանցված չէ'}
     }
     const expires = parseExpiryDate(expiryDate);
     if(expires.error){
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
          return {success: 'Խնդրում ենք սպասել․․․'}
     }
     return {error: "Քարտի ժամկետը պարտադիր է"}
}

export const getSubscriptionLevel = cache(async(userId: string): Promise<UserPlan> => {
     const user = await getUserById(userId);
     if(!user || !user.id){
          throw new Error("Այս օգտագործողը նույնականացված չէ։")
     }
     if(!user.currentPlan){
          throw new Error("Այսպիսի տարբերակ գոյություն չունի։")
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
     if(!user){
          return {error: "Այս օգտագործողը նույնականացված չէ։"}
     }
     const subscription = user.subscriptionId ? await getSubscriptionById(user.subscriptionId) : null
     if(!subscription){
          return {error: "Այս օգտագործողը բաժանորդագրված չէ։"}
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
     revalidatePath("/settings?tab=subscription")
     return {success: true}
}

export const renewSubscription = async(userId: string) => {
     const user = await getUserById(userId);
     if(!user || !user.id){
          return {error: "Այս օգտագործողը նույնականացված չէ։"}
     }
     const subscription = user.subscriptionId ? await getSubscriptionById(user.subscriptionId) : null
     if(!subscription){
          return {error: "Այս օգտագործողը բաժանորդագրված չէ։"}
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
     revalidatePath("/settings?tab=subscription")
     return {success: true}
}