import { db } from "@/lib/db"
import { getUserById } from "./user"
import { ERROR_MESSAGES } from "@/lib/constants"
import { logAction } from "./logs"
import { getIpAddress } from "@/lib/limiter"

export const getSubscriptionById = async(id: string) => {
     try{
          const subscription = await db.subscription.findUnique({
               where: { id }
          })
          return subscription
     } catch{
          return null
     }
}

export const getSubscriptionsByUserId = async(userId: string) => {
     try{
          const subscriptions = await db.subscription.findMany({
               where: { userId }
          })
          return subscriptions
     } catch{
          return null
     }
}

export const getCurrentSubscription = async(userId: string,subscriptionId: string) => {
     try{
          const subscription = await db.subscription.findUnique({
               where: {
                    userId,
                    id: subscriptionId
               }
          })
          return subscription
     } catch{
          return null
     }
}

export const getIsSubscriptionExpired = async(userId: string) => {
     const user = await getUserById(userId);
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: { ip: await getIpAddress() }
          })
          throw new Error(ERROR_MESSAGES.auth.unauthorized)
     }
     const subscription = user.subscriptionId ? await getCurrentSubscription(user.id,user.subscriptionId) : null
     return !!subscription && new Date(subscription.endDate) < new Date()
}