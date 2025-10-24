"use server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResumeFormSchema } from "@/schemas"
import { ResumeFormType } from "@/lib/types/schema"
import {del, put} from "@vercel/blob"
import path from "path"
import { getSubscriptionLevel } from "../subscription-system"
import { getAvailableFeatures } from "@/lib/permission"
import { getCurrentResumeByUserId, getResumeCountByUserId } from "@/data/resumes"
import { getIpAddress } from "@/actions/ip"
import { logAction } from "@/data/logs"
import { ERROR_MESSAGES } from "@/lib/constants"

export const saveResume = async(values: ResumeFormType,templateId?: string) => {
     const {id} = values
     const currIp = await getIpAddress();

     const validatedFields = ResumeFormSchema.safeParse(values);
     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(val=>val.path[0]),
               }
          })
          throw new Error(ERROR_MESSAGES.validationError)
     }
     const {profileImg, experience, education, courses, links, references, skills, languages, ...resumeValues} = validatedFields.data

     const user = await currentUser();

     if(!user || !user.id){
          await logAction({
               action: 'UNAUTHORIZED',
               metadata: {
                    ip: currIp,
               }
          })
          throw new Error(ERROR_MESSAGES.auth.unauthorized)
     }

     const subscriptionLevel = await getSubscriptionLevel(user.id);
     const {canCreateResume, canUseCustomization} = getAvailableFeatures(subscriptionLevel)

     if(!id){
          const resumeCount = await getResumeCountByUserId(user.id);
          if(!canCreateResume(resumeCount)){
               await logAction({
                    userId: user.id,
                    action: "ACTION_ERROR",
                    metadata: {
                         ip: currIp,
                         reason: ERROR_MESSAGES.subscription.limitedResumeCount
                    }
               })
               throw new Error(ERROR_MESSAGES.subscription.limitedResumeCount)
          }
     }

     const existingResume = id ? await getCurrentResumeByUserId(user.id,id) : null;

     if(id && !existingResume){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.content.noResume
               }
          })
          throw new Error(ERROR_MESSAGES.content.noResume)
     }

     const hasCustomizations = (resumeValues.borderStyle && resumeValues.borderStyle!==existingResume?.borderStyle) || (resumeValues.colorHex && resumeValues.colorHex !== existingResume?.colorHex);

     if(hasCustomizations && !canUseCustomization){
          resumeValues.colorHex = undefined
          resumeValues.borderStyle = undefined
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.subscription.noCustomization
               }
          })
          throw new Error(ERROR_MESSAGES.subscription.noCustomization)
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
          await logAction({
               userId: user.id,
               action: "RESUME_UPDATED",
               metadata: {
                    ip: currIp,
                    resumeId: id
               }
          })
          return db.resume.update({
               where: {id},
               data: {
                    ...resumeValues,
                    profileImg: newImgUrl,
                    templateId: !templateId ? null : templateId,
                    experience: {
                         deleteMany: {},
                         create: experience?.map(exp=>({
                              ...exp,
                              startDate: exp?.startDate ? new Date(exp.startDate) : undefined,
                              endDate: exp?.endDate ? new Date(exp.endDate) : undefined
                         })),
                    },
                    education: {
                         deleteMany: {},
                         create: education?.map(edu=>({
                              ...edu,
                              startDate: edu?.startDate ? new Date(edu.startDate) : undefined,
                              endDate: edu?.endDate ? new Date(edu.endDate) : undefined
                         }))
                    },
                    courses: {
                         deleteMany: {},
                         create: courses?.map(course=>({
                              ...course,
                              startDate: course?.startDate ? new Date(course.startDate) : undefined,
                              endDate: course?.endDate ? new Date(course.endDate) : undefined
                         }))
                    },
                    references: {
                         deleteMany: {},
                         create: references
                    },
                    links: {
                         deleteMany: {},
                         create: links
                    },
                    skills: {
                         deleteMany: {},
                         create: skills
                    },
                    languages: {
                         deleteMany: {},
                         create: languages
                    },
                    updatedAt: new Date()
               }
          })
     } else {
          const newResume = await db.resume.create({
               data: {
                    ...resumeValues,
                    profileImg: newImgUrl,
                    templateId: !templateId ? null : templateId,
                    experience: {
                         create: experience?.map(exp=>({
                              ...exp,
                              startDate: exp?.startDate ? new Date(exp.startDate) : undefined,
                              endDate: exp?.endDate ? new Date(exp.endDate) : undefined
                         })),
                    },
                    education: {
                         create: education?.map(edu=>({
                              ...edu,
                              startDate: edu?.startDate ? new Date(edu.startDate) : undefined,
                              endDate: edu?.endDate ? new Date(edu.endDate) : undefined
                         }))
                    },
                    courses: {
                         create: courses?.map(course=>({
                              ...course,
                              startDate: course?.startDate ? new Date(course.startDate) : undefined,
                              endDate: course?.endDate ? new Date(course.endDate) : undefined
                         }))
                    },
                    references: { create: references },
                    links: { create: links },
                    skills: { create: skills },
                    languages: { create: languages },
                    title: resumeValues.title || "Անանուն ռեզյումե",
                    userId: user.id,
                    updatedAt: new Date(),
               }
          })
          await logAction({
               userId: user.id,
               action: 'RESUME_CREATED',
               metadata: { ip: currIp, resumeId: newResume.id }
          })
          return newResume
     }
}