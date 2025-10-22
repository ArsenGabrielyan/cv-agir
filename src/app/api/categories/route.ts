import { currentUser, getIsAdmin } from "@/lib/auth"
import { IAdminAPISearchParams } from "@/lib/types";
import { db } from "@/lib/db";
import { ResumeTemplateCategory } from "@db";
import { NextRequest, NextResponse } from "next/server";
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
                    route: req.url
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
     const params = Object.fromEntries(searchParams.entries().map(([k,v])=>[k,JSON.parse(v)])) as IAdminAPISearchParams<ResumeTemplateCategory>;
     const {filter, range, sort} = params;
     const orderbyClause = sort && Array.isArray(sort) && sort.length===2 ? {[sort[0]]: sort[1].toLowerCase()} : undefined;
     const data = await db.resumeTemplateCategory.findMany({
          where: {
               name: {
                    contains: filter.name ?? "",
                    mode: 'insensitive'
               }
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
                    route: req.url
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
     const {name}: ResumeTemplateCategory = await req.json();
     const data = await db.resumeTemplateCategory.create({
          data: {
               name
          }
     })
     await logAction({
          userId: user.id,
          action: "CATEGORY_CREATED",
          metadata: {
               ip,
               categoryId: data.id
          }
     })
     return NextResponse.json(data)
}