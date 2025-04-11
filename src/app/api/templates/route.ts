import { getIsAdmin } from "@/lib/auth"
import { IAdminAPISearchParams } from "@/data/types";
import { db } from "@/lib/db";
import { ResumeTemplate } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
     const isAdmin = await getIsAdmin();
     if(!isAdmin){
          return new NextResponse("Այս հաշիվը մուտք գործված չէ կամ ադմինիստրատորի իրավունքները չունի։",{ status: 401 })
     }
     const searchParams = req.nextUrl.searchParams;
     const params = Object.fromEntries(searchParams.entries().map(([k,v])=>[k,JSON.parse(v)])) as IAdminAPISearchParams<ResumeTemplate>
     const {filter,sort,range} = params;
     const orderbyClause = sort && Array.isArray(sort) && sort.length===2 ? {[sort[0]]: sort[1].toLowerCase()} : undefined;
     const data = await db.resumeTemplate.findMany({
          where: {
               name: {
                    contains: filter.name || "",
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
     if(!isAdmin){
          return new NextResponse("Այս հաշիվը մուտք գործված չէ կամ ադմինիստրատորի իրավունքները չունի։",{ status: 401 })
     }
     const {name, description, imageName, htmlTemplate, cssStyle, categoryId, isPremium} = await req.json();
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
     return NextResponse.json(data)
}