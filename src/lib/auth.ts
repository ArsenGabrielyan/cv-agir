import { auth } from "@/auth"
import { ExtendedUser } from "@/next-auth";

export type CurrentUserReturnType = Omit<ExtendedUser,"currentPlan">

export const currentUser = async (): Promise<CurrentUserReturnType | undefined> => {
     const session = await auth();
     const obj = session?.user;
     if(obj){
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {currentPlan,...user} = obj;
          return user
     }
     return undefined
}