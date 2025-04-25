"use server"
import { signOut } from "@/auth"
import { logAction } from "@/data/db/logs"
import { currentUser } from "@/lib/auth"
import { getIpAddress } from "@/lib/limiter"

export const logout = async() => {
     const user = await currentUser();
     await logAction({
          userId: user?.id,
          action: "LOGOUT",
          metadata: {
               ip: await getIpAddress(),
               email: user?.email || "Անհայտ էլ․ հասցե"
          }
     })
     await signOut({redirectTo: "/auth/login"})
}