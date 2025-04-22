import { db } from "@/lib/db";
import { AccountSettingsType } from "../types/schema";
import { clearLimiter, incrementLimiter } from "@/lib/limiter";

export const getUserByEmail = async (email: string) => {
     try{
          const user = await db.user.findUnique({
               where: {email}
          })
          return user
     } catch{
          return null
     }
}

export const getUserById = async (id: string) => {
     try{
          const user = await db.user.findUnique({
               where: {id}
          })
          return user
     } catch{
          return null
     }
}

export const updateUser = async(userId: string, values: AccountSettingsType, limiterKey: string, successMsg = "Կարգավորումները թարմացված են") => {
     try {
          const {showAddress,showEmail,showPhone,showLinks,...rest} = values
          clearLimiter(limiterKey)
          await db.user.update({
               where: {
                    id: userId
               },
               data: {
                    ...rest,
                    email: rest.email?.trim().toLowerCase(),
                    name: rest.name?.trim(),
                    jobTitle: rest.jobTitle?.trim(),
                    address: rest.address?.trim(),
                    summary: rest.summary?.trim(),
                    hobbies: rest.hobbies?.trim(),
                    cvPageSettings: {
                         showAddress,
                         showEmail,
                         showPhone,
                         showLinks
                    }
               }
          })
          return {success: successMsg}
     } catch {
          incrementLimiter(limiterKey,60_000)
          return {error: "Չհաջողվեց թարմացնել կարգավորումները"}
     }
}