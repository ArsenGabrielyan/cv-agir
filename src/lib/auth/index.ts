import { auth } from "@/auth"
import { ExtendedUser } from "@/global";

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

const adminIds = [
     "6811284e5e4734e57b6b29fe"
]
export const getIsAdmin = async()=>{
     const user = await currentUser();
     if(!user || !user.id) return false;
     return adminIds.includes(user.id);
}