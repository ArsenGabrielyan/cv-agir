"use server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResumeFormSchema } from "@/schemas"
import { ResumeFormType } from "@/schemas/types"
import {del, put} from "@vercel/blob"
import path from "path"

export const saveResume = async(values: ResumeFormType) => {
     const {id} = values

     const validatedFields = ResumeFormSchema.safeParse(values);

     if(!validatedFields.success){
          throw new Error("Ռեզյումեն վալիդացրած չէ")
     }

     const {
          profileImg, education, experience, courses, ...resumeValues
     } = validatedFields.data;

     const user = await currentUser();

     if(!user || !user.id){
          throw new Error("Օգտագործողը նույնականացված չէ")
     }

     // TODO: Check Resume Count For Free Users

     const existingResume = id ? await db.resume.findUnique({
          where: {
               id,userId: user.id
          }
     }) : null

     if(id && !existingResume){
          throw new Error("Ռեզյումեն չի գտնվել")
     }

     let newImgUrl: string | undefined | null = undefined;

     if(profileImg instanceof File){
          if(existingResume?.profileImg){
               await del(existingResume.profileImg)
          }
          const blob = await put(`resume-photos/${path.extname(profileImg.name)}`,profileImg,{
               access: "public"
          });

          newImgUrl = blob.url
     } else if(profileImg===null){
          if(existingResume?.profileImg){
               await del(existingResume.profileImg)
          }
          newImgUrl = null;
     }

     if(id){
          return await db.resume.update({
               where: {id},
               data: {
                    ...resumeValues,
                    profileImg: newImgUrl,
                    experience: experience?.map(exp=>({
                         ...exp,
                         startDate: exp?.startDate ? new Date(exp.startDate) : undefined,
                         endDate: exp?.endDate ? new Date(exp.endDate) : undefined
                    })),
                    education: education?.map(edu=>({
                         ...edu,
                         startDate: edu?.startDate ? new Date(edu.startDate) : undefined,
                         endDate: edu?.endDate ? new Date(edu.endDate) : undefined
                    })),
                    courses: courses?.map(course=>({
                         ...course,
                         startDate: course?.startDate ? new Date(course.startDate) : undefined,
                         endDate: course?.endDate ? new Date(course.endDate) : undefined
                    })),
                    updatedAt: new Date()
               }
          })
     } else {
          return await db.resume.create({
               data: {
                    ...resumeValues,
                    profileImg: newImgUrl,
                    title: resumeValues.title || "Անանուն ռեզյումե",
                    userId: user.id,
                    experience: experience?.map(exp=>({
                         ...exp,
                         startDate: exp?.startDate ? new Date(exp.startDate) : undefined,
                         endDate: exp?.endDate ? new Date(exp.endDate) : undefined
                    })),
                    education: education?.map(edu=>({
                         ...edu,
                         startDate: edu?.startDate ? new Date(edu.startDate) : undefined,
                         endDate: edu?.endDate ? new Date(edu.endDate) : undefined
                    })),
                    courses: courses?.map(course=>({
                         ...course,
                         startDate: course?.startDate ? new Date(course.startDate) : undefined,
                         endDate: course?.endDate ? new Date(course.endDate) : undefined
                    })),
                    updatedAt: new Date()
               }
          })
     }
}