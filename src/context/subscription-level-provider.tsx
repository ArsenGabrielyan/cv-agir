"use client"

import { UserPlan } from "@db/client"
import { createContext, ReactNode, useContext } from "react"

const SubscriptionLevelContext = createContext<UserPlan | undefined>(undefined)

interface SubscriptionLevelProviderProps{
     children: ReactNode,
     subscriptionLevel: UserPlan
}

export default function SubscriptionLevelProvider({children, subscriptionLevel}: SubscriptionLevelProviderProps){
     return <SubscriptionLevelContext.Provider value={subscriptionLevel}>
          {children}
     </SubscriptionLevelContext.Provider>
}

export const useSubscriptionLevel = () => {
     const context = useContext(SubscriptionLevelContext);
     if(context===undefined){
          throw new Error("useSubscriptionLevel must be used within SubscriptionLevelProvider")
     }
     return context
}