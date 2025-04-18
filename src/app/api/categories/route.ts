import { getIsAdmin } from "@/lib/auth"
import { IAdminAPISearchParams } from "@/data/types";
import { db } from "@/lib/db";
import { ResumeTemplateCategory } from "@db/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
     const isAdmin = await getIsAdmin();
     if(!isAdmin){
          return new NextResponse("Այս հաշիվը մուտք գործված չէ կամ ադմինիստրատորի իրավունքները չունի։",{ status: 401 })
     }
     const searchParams = req.nextUrl.searchParams;
     const params = Object.fromEntries(searchParams.entries().map(([k,v])=>[k,JSON.parse(v)])) as IAdminAPISearchParams<ResumeTemplateCategory>;
     const {filter, range, sort} = params;
     const orderbyClause = sort && Array.isArray(sort) && sort.length===2 ? {[sort[0]]: sort[1].toLowerCase()} : undefined;
     const data = await db.resumeTemplateCategory.findMany({
          where: {
               name: {
                    contains: filter.name,
                    mode: 'insensitive'
               }
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
     const {name} = await req.json();
     const data = await db.resumeTemplateCategory.create({
          data: {
               name
          }
     })
     return NextResponse.json(data)
}