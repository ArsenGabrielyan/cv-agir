"use server"
import { getCurrentResumeByUserId } from "@/data/db/resumes";
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export const deleteResume = async (id: string) => {
     const user = await currentUser();
     if(!user || !user.id){
          throw new Error("Օգտագործողը նույնականացված չէ")
     }
     const resume = await getCurrentResumeByUserId(user.id,id);
     if(!resume){
          throw new Error("Ռեզյումեն չի գտնվել")
     }
     if(resume.profileImg){
          await del(resume.profileImg)
     }
     await db.resume.delete({where: { id }})
     revalidatePath("/dashboard")
}