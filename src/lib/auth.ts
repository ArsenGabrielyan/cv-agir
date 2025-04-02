import { auth } from "@/auth"

export const currentUser = async () => {
     const session = await auth();
     const obj = session?.user;
     if(obj){
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {currentPlan,...user} = obj;
          return user
     }
     return undefined
}