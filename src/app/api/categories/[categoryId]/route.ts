import { getResumeTemplateCategoryById } from "@/data/resumes";
import { currentUser, getIsAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { logAction } from "@/data/logs";
import { ERROR_MESSAGES } from "@/lib/constants";
import { getIpAddress } from "@/lib/limiter";
import { ResumeTemplateCategory } from "@db";

export const GET = async(
     req: Request,
     {params}: {params: Promise<{categoryId: string}>}
) => {
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
     const {categoryId} = await params
     const data = await getResumeTemplateCategoryById(categoryId)
     return NextResponse.json(data)
}

export const PUT = async(
     req: Request,
     {params}: {params: Promise<{categoryId: string}>}
) => {
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
     const {categoryId} = await params
     const {name}: ResumeTemplateCategory = await req.json()
     const data = await db.resumeTemplateCategory.update({
          where: {
               id: categoryId
          },
          data: {
               name
          }
     });
     await logAction({
          userId: user.id,
          action: "CATEGORY_UPDATED",
          metadata: { ip, categoryId }
     })
     return NextResponse.json(data)
}

export const DELETE = async(
     req: Request,
     {params}: {params: Promise<{categoryId: string}>}
) => {
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
     const {categoryId} = await params;
     const currCategory = await getResumeTemplateCategoryById(categoryId);
     if(!currCategory){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip,
                    reason: ERROR_MESSAGES.content.noCategory,
               }
          })
          return new NextResponse(ERROR_MESSAGES.content.noCategory,{ status: 404 })
     }
     const data = await db.resumeTemplateCategory.delete({
          where: {
               id: categoryId
          }
     })
     await logAction({
          userId: user.id,
          action: "CATEGORY_DELETED",
          metadata: { ip, categoryId }
     })
     return NextResponse.json(data)
}