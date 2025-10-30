import { auth } from "@/auth"
import { ExtendedUser } from "@/global";
import { db } from "../db";

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

export const getIsAdmin = async()=>{
     const user = await currentUser();
     if(!user || !user.id) return false;
     const adminUser = await db.user.findUnique({
          where: {
               id: user.id
          },
          select: {
               isAdmin: true,
          }
     })
     return !!adminUser && adminUser.isAdmin
}