import { getIsAdmin, currentUser } from "@/lib/auth"
import { IAdminAPISearchParams } from "@/lib/types";
import { db } from "@/lib/db";
import { ResumeTemplate } from "@db";
import { NextResponse, NextRequest } from "next/server";
import { ERROR_MESSAGES } from "@/lib/constants";
import { logAction } from "@/data/logs";
import { getIpAddress } from "@/actions/ip";

export const GET = async (req: NextRequest) => {
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
     const params = Object.fromEntries(searchParams.entries().map(([k,v])=>[k,JSON.parse(v)])) as IAdminAPISearchParams<ResumeTemplate>
     const {filter,sort,range} = params;
     const orderbyClause = sort && Array.isArray(sort) && sort.length===2 ? {[sort[0]]: sort[1].toLowerCase()} : undefined;
     const data = await db.resumeTemplate.findMany({
          where: {
               name: {
                    contains: filter.name ?? "",
                    mode: 'insensitive'
               },
               isPremium: filter.isPremium,
               categoryId: filter.categoryId
          },
          ...(orderbyClause ? {orderBy: orderbyClause} : {})
     });
     return NextResponse.json(range ? data.slice(range[0],range[1]+1) : data);
}

export const POST = async(req: Request) => {
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
     const {name, description, imageName, htmlTemplate, cssStyle, categoryId, isPremium}: ResumeTemplate = await req.json();
     const data = await db.resumeTemplate.create({
          data: {
               name,
               description,
               imageName,
               htmlTemplate,
               cssStyle,
               categoryId,
               isPremium
          }
     })
     await logAction({
          userId: user.id,
          action: "TEMPLATE_CREATED",
          metadata: {ip, templateId: data.id}
     })
     return NextResponse.json(data)
}