"use server"
import { logAction } from "@/data/db/logs";
import { getCurrentResumeByUserId } from "@/data/db/resumes";
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db";
import { getIpAddress } from "@/lib/limiter";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import {ERROR_MESSAGES} from "@/data/constants"

export const deleteResume = async (id: string) => {
     const currIp = await getIpAddress()
     const user = await currentUser();
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          throw new Error(ERROR_MESSAGES.auth.unauthorized)
     }
     const resume = await getCurrentResumeByUserId(user.id,id);
     if(!resume){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.content.noResume
               }
          })
          throw new Error(ERROR_MESSAGES.content.noResume)
     }
     if(resume.profileImg){
          try{
               await del(resume.profileImg)
          } catch (e){
               console.error(e);
               await logAction({
                    userId: user.id,
                    action: "ACTION_ERROR",
                    metadata: {
                         ip: currIp,
                         reason: ERROR_MESSAGES.content.failedImageDelete
                    }
               })
          }
     }
     await db.resume.delete({where: { id }})
     await logAction({
          userId: user.id,
          action: "RESUME_DELETED",
          metadata: {
               ip: currIp,
               resumeId: id
          }
     })
     revalidatePath("/dashboard?show=resume")
}