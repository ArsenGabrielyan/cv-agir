import { db } from "@/lib/db"

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