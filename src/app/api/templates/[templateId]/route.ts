import { getResumeTemplateById } from "@/data/db/resumes";
import { getIsAdmin } from "@/data/helpers/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async(
     _: Request,
     {params}: {params: Promise<{templateId: string}>}
) => {
     const isAdmin = await getIsAdmin();
     if(!isAdmin){
          return new NextResponse("Այս հաշիվը մուտք գործված չէ կամ ադմինիստրատորի իրավունքները չունի։",{ status: 401 })
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
     if(!isAdmin){
          return new NextResponse("Այս հաշիվը մուտք գործված չէ կամ ադմինիստրատորի իրավունքները չունի։",{ status: 401 })
     }
     const {templateId} = await params
     const {name, description, imageName, htmlTemplate, cssStyle, categoryId, isPremium} = await req.json();
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
     return NextResponse.json(data)
}

export const DELETE = async(
     _: Request,
     {params}: {params: Promise<{templateId: string}>}
) => {
     const isAdmin = await getIsAdmin();
     if(!isAdmin){
          return new NextResponse("Այս հաշիվը մուտք գործված չէ կամ ադմինիստրատորի իրավունքները չունի։",{ status: 401 })
     }
     const {templateId} = await params
     const data = await db.resumeTemplate.delete({
          where: {
               id: templateId
          }
     })
     return NextResponse.json(data)
}