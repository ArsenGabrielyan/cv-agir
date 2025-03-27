"use server"

import { db } from "@/lib/db"

export const getTemplates = async()=>{
     const templates = await db.resumeTemplate.findMany();
     return templates
}