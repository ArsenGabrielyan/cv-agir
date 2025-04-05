import { UserPlan } from "@prisma/client";
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
     const { data: session } = useSession();
     if (session?.user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { currentPlan, ...user } = session.user;
          return user;
     }
     return undefined;
};

export const useCurrentSubscriptionLevel = (isExpired: boolean): UserPlan => {
     const { data: session } = useSession();
     if(session?.user){
          return isExpired ? "free" : session?.user.currentPlan || "free"
     }
     return "free";
}