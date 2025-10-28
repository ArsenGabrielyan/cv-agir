import { db } from "@/lib/db";
import { SettingsType } from "../schemas/types";
import { clearLimiter, incrementLimiter } from "@/lib/limiter";
import { ERROR_MESSAGES } from "@/lib/constants";
import { logAction } from "./logs";
import { getIpAddress } from "@/actions/ip";
import { userInclude } from "@/lib/types";

export const getUserByEmail = async (email: string) => {
     try{
          const user = await db.user.findUnique({
               where: {email},
               include: userInclude
          })
          return user
     } catch{
          return null
     }
}

export const getUserById = async (id: string) => {
     try{
          const user = await db.user.findUnique({
               where: {id},
               include: userInclude
          })
          return user
     } catch{
          return null
     }
}

export const updateUser = async(userId: string, values: SettingsType, limiterKey: string, successMsg = "Կարգավորումները թարմացված են") => {
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
                         delete:{},
                         create: {
                              showAddress,
                              showEmail,
                              showPhone,
                              showLinks
                         }
                    }
               }
          })
          return {success: successMsg}
     } catch {
          incrementLimiter(limiterKey,60_000);
          await logAction({
               userId,
               action: "ACTION_ERROR",
               metadata: {
                    ip: await getIpAddress(),
                    reason: ERROR_MESSAGES.settingsError
               }
          })
          return {error: ERROR_MESSAGES.settingsError}
     }
}