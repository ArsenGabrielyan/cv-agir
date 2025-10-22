import { db } from "@/lib/db"
import { AuditAction, Prisma } from "@db"
import { AuditMetadata } from "../lib/types"
import { maskEmail } from "@/lib/helpers/audit-logs"

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
          await db.auditLog.create({
               data: {
                    userId,
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