import { ERROR_MESSAGES } from "@/lib/constants";
import { logAction } from "@/data/logs";
import { getActionsByFuzzyText } from "@/lib/helpers/audit-logs";
import { AuditActionKey, AuditLogServerData, auditLogsInclude, IAdminAPISearchParams} from "@/lib/types";
import { getIsAdmin, currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIpAddress } from "@/lib/limiter";
import { NextResponse, NextRequest } from "next/server";

export const GET = async(req: NextRequest) => {
     const isAdmin = await getIsAdmin();
     const ip = await getIpAddress();
     const user = await currentUser();
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip,
                    route: req.url,
               }
          })
          return new NextResponse(ERROR_MESSAGES.auth.unauthorized,{ status: 401 })
     }
     if(!isAdmin){
          await logAction({
               userId: user.id,
               action: "NO_ADMIN_ACCESS",
               metadata: {
                    ip,
                    route: req.url,
                    method: req.method,
               }
          })
          return new NextResponse(ERROR_MESSAGES.auth.noAdminAccess,{ status: 401 })
     }
     const searchParams = req.nextUrl.searchParams;
     const params = Object.fromEntries(searchParams.entries().map(([k,v])=>[k,JSON.parse(v)])) as IAdminAPISearchParams<AuditLogServerData>
     const {filter} = params
     const actions = filter.q ? getActionsByFuzzyText(filter.q) : undefined;
     const filters = Object.keys(filter)
          .filter(key => key.startsWith("action-"))
          .map(key => filter[key as AuditActionKey])
          .flat();
     const data = await db.auditLog.findMany({
          where: {
               ...(filter.q && {
                    OR: [
                         {user: {name: {contains: filter.q, mode: "insensitive"}}},
                         ...(actions?.length ? [
                              { action: { in: actions } }
                         ] : []),
                    ]
               }),
               ...(filters.length ? { action: { in: filters } } : {}),
               ...(filter.fromDate || filter.toDate ? {
                    createdAt: {
                         ...(filter.fromDate && { gte: new Date(filter.fromDate) }),
                         ...(filter.toDate && { lte: new Date(filter.toDate) }),
                    }
               } : {}),
          },
          orderBy: {
               createdAt: "desc"
          },
          include: auditLogsInclude
     });
     return NextResponse.json(data)
}