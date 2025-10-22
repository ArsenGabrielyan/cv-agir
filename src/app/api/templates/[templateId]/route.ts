import { ERROR_MESSAGES } from "@/lib/constants";
import { getResumeTemplateById } from "@/data/resumes";
import { currentUser, getIsAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { logAction } from "@/data/logs";
import { getIpAddress } from "@/actions/ip";
import { ResumeTemplate } from "@db";

export const GET = async(
     req: Request,
     {params}: {params: Promise<{templateId: string}>}
) => {
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
     const {templateId} = await params
     const data = await getResumeTemplateById(templateId);
     return NextResponse.json(data)
}

export const PUT = async(
     req: Request,
     {params}: {params: Promise<{templateId: string}>}
) => {
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
     const {templateId} = await params
     const {name, description, imageName, htmlTemplate, cssStyle, categoryId, isPremium}: ResumeTemplate = await req.json();
     const data = await db.resumeTemplate.update({
          where: {
               id: templateId
          },
          data: {
               name,
               description,
               imageName,
               htmlTemplate,
               cssStyle,
               categoryId,
               isPremium
          }
     });
     await logAction({
          userId: user.id,
          action: 'TEMPLATE_UPDATED',
          metadata: {ip, templateId}
     })
     return NextResponse.json(data)
}

export const DELETE = async(
     req: Request,
     {params}: {params: Promise<{templateId: string}>}
) => {
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
     const {templateId} = await params
     const currTemplate = await getResumeTemplateById(templateId);
     if(!currTemplate){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip,
                    reason: ERROR_MESSAGES.content.noTemplate
               }
          })
          return new NextResponse(ERROR_MESSAGES.content.noTemplate,{ status: 400 })
     }
     const data = await db.resumeTemplate.delete({
          where: {
               id: templateId
          }
     })
     await logAction({
          userId: user.id,
          action: 'TEMPLATE_DELETED',
          metadata: {ip, templateId}
     })
     return NextResponse.json(data)
}