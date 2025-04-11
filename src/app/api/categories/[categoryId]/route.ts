import { getResumeTemplateCategoryById } from "@/data/db/resumes";
import { getIsAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async(
     _: Request,
     {params}: {params: Promise<{categoryId: string}>}
) => {
     const isAdmin = await getIsAdmin();
     if(!isAdmin){
          return new NextResponse("Այս հաշիվը մուտք գործված չէ կամ ադմինիստրատորի իրավունքները չունի։",{ status: 401 })
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
     if(!isAdmin){
          return new NextResponse("Այս հաշիվը մուտք գործված չէ կամ ադմինիստրատորի իրավունքները չունի։",{ status: 401 })
     }
     const {categoryId} = await params
     const {name} = await req.json()
     const data = await db.resumeTemplateCategory.update({
          where: {
               id: categoryId
          },
          data: {
               name
          }
     });
     return NextResponse.json(data)
}

export const DELETE = async(
     _: Request,
     {params}: {params: Promise<{categoryId: string}>}
) => {
     const isAdmin = await getIsAdmin();
     if(!isAdmin){
          return new NextResponse("Այս հաշիվը մուտք գործված չէ կամ ադմինիստրատորի իրավունքները չունի։",{ status: 401 })
     }
     const {categoryId} = await params;
     const currCategory = await getResumeTemplateCategoryById(categoryId);
     if(!currCategory){
          return new NextResponse("Այս կատեգորիան գոյություն չունի",{ status: 400 })
     }
     const data = await db.resumeTemplateCategory.delete({
          where: {
               id: categoryId
          }
     })
     return NextResponse.json(data)
}