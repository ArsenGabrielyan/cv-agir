"use server"
import { ERROR_MESSAGES } from "@/data/constants";
import { getCurrentCoverLetterByUserId } from "@/data/db/cover-letters";
import { logAction } from "@/data/db/logs";
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db";
import { getIpAddress } from "@/lib/limiter";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export const deleteCoverLetter = async (id: string) => {
     const user = await currentUser();
     const currIp = await getIpAddress();
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          throw new Error(ERROR_MESSAGES.auth.unauthorized)
     }
     const coverLetter = await getCurrentCoverLetterByUserId(user.id,id);
     if(!coverLetter){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.content.noCoverLetter
               }
          })
          throw new Error(ERROR_MESSAGES.content.noCoverLetter)
     }
     if(coverLetter.profileImg){
          try{
               await del(coverLetter.profileImg)
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
     await db.coverLetter.delete({where: { id }})
     await logAction({
          userId: user.id,
          action: "COVER_LETTER_DELETED",
          metadata: {
               ip: currIp,
               coverLetterId: id
          }
     })
     revalidatePath("/dashboard?show=cover-letter")
}