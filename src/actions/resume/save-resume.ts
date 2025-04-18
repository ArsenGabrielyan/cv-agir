"use server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResumeFormSchema } from "@/schemas"
import { ResumeFormType } from "@/data/types/schema"
import {del, put} from "@vercel/blob"
import path from "path"
import { getSubscriptionLevel } from "../subscription-system"
import { getAvailableFeatures } from "@/lib/permission"
import { getCurrentResumeByUserId, getResumeCountByUserId } from "@/data/db/resumes"

export const saveResume = async(values: ResumeFormType,templateId?: string) => {
     const {id} = values

     const validatedFields = ResumeFormSchema.safeParse(values);
     if(!validatedFields.success){
          throw new Error("Բոլոր դաշտերը վալիդացրած չէն")
     }
     const {profileImg, experience, education, courses, ...resumeValues} = validatedFields.data

     const user = await currentUser();

     if(!user || !user.id){
          throw new Error("Օգտագործողը նույնականացված չէ")
     }

     const subscriptionLevel = await getSubscriptionLevel(user.id);
     const {canCreateResume, canUseCustomization} = getAvailableFeatures(subscriptionLevel)

     if(!id){
          const resumeCount = await getResumeCountByUserId(user.id);
          if(!canCreateResume(resumeCount)){
               throw new Error("Անվճար բաժանորդագրության համար առավելագույն ռեզյումեների քանակը սպառվել է")
          }
     }

     const existingResume = id ? await getCurrentResumeByUserId(user.id,id) : null;

     if(id && !existingResume){
          throw new Error("Ռեզյումեն չի գտնվել")
     }

     const hasCustomizations = (resumeValues.borderStyle && resumeValues.borderStyle!==existingResume?.borderStyle) || (resumeValues.colorHex && resumeValues.colorHex !== existingResume?.colorHex);

     if(hasCustomizations && !canUseCustomization){
          resumeValues.colorHex = undefined
          resumeValues.borderStyle = undefined
          throw new Error("Ամբողջական դիզայնի ձևափոխությունը այս բաժանորդագրությունում արգելված է")
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
          return db.resume.update({
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
                    templateId,
                    updatedAt: new Date()
               }
          })
     } else {
          return db.resume.create({
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
                    templateId,
                    updatedAt: new Date()
               }
          })
     }
}