import { db } from "@/lib/db"
import { AuditAction, Prisma } from "@db"
import { AuditMetadata } from "../types"
import { maskEmail } from "../helpers/audit-logs"
import { isObjectId } from "../helpers"

type LogActionOptions<A extends AuditAction> = AuditMetadata<A> extends undefined ? {
     userId?: string
     action: A,
     metadata?: never
} : {
     userId?: string
     action: A,
     metadata: AuditMetadata<A>
}

export async function logAction<A extends AuditAction>({userId,action,metadata}: LogActionOptions<A>){
     try{
          let targetUserId: string | undefined;
          if (userId && isObjectId(userId)) {
               targetUserId = userId;
          } else if (userId) {
               const user = await db.user.findUnique({
                    where: { id: userId },
                    select: { id: true },
               });
               targetUserId = user?.id;
          }
          await db.auditLog.create({
               data: {
                    ...(targetUserId && { userId: targetUserId }),
                    action,
                    ...(metadata !== undefined && { metadata: JSON.parse(JSON.stringify({
                         ...metadata,
                         ...("email" in metadata && {email: metadata.email ? maskEmail(metadata.email) : "Անհայտ էլ․ հասցե"}),
                    })) as Prisma.InputJsonValue })
               }
          });
     } catch(error){
          console.error(error)
     }
}

export async function getLogById(id: string){
     try{
          const log = await db.auditLog.findUnique({
               where: {id}
          })
          return log
     } catch{
          return null
     }
}