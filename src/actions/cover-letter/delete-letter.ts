"use server"
import { getCurrentCoverLetterByUserId } from "@/data/db/cover-letters";
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export const deleteCoverLetter = async (id: string) => {
     const user = await currentUser();
     if(!user || !user.id){
          throw new Error("Օգտագործողը նույնականացված չէ")
     }
     const coverLetter = await getCurrentCoverLetterByUserId(user.id,id);
     if(!coverLetter){
          throw new Error("Ուղեկցող նամակը չի գտնվել")
     }
     if(coverLetter.profileImg){
          await del(coverLetter.profileImg)
     }
     await db.coverLetter.delete({where: { id }})
     revalidatePath("/dashboard?show=cover-letter")
}