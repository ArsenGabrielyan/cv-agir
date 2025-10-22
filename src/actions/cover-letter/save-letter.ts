"use server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { CoverLetterFormSchema } from "@/schemas"
import { CoverLetterFormType } from "@/lib/types/schema"
import {del, put} from "@vercel/blob"
import path from "path"
import { getSubscriptionLevel } from "../subscription-system"
import { getAvailableFeatures } from "@/lib/permission"
import { getCurrentCoverLetterByUserId } from "@/data/cover-letters"
import { getIpAddress } from "@/actions/ip"
import { logAction } from "@/data/logs"
import {ERROR_MESSAGES} from "@/lib/constants"

export const saveCoverLetter = async(values: CoverLetterFormType) => {
     const {id} = values
     const currIp = await getIpAddress();

     const validatedFields = CoverLetterFormSchema.safeParse(values);
     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(val=>val.path[0]),
               }
          })
          throw new Error(ERROR_MESSAGES.validationError)
     }
     const {profileImg, letterDate, ...coverLetterValues} = validatedFields.data

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
     const {canCreateCoverLetters, canUseCustomization} = getAvailableFeatures(subscriptionLevel);

     if(!id && !canCreateCoverLetters){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.subscription.noAccessToCoverLetter
               }
          })
          throw new Error(ERROR_MESSAGES.subscription.noAccessToCoverLetter)
     }

     const existingCoverLetter = id ? await getCurrentCoverLetterByUserId(user.id,id) : null;

     if(id && !existingCoverLetter){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: ERROR_MESSAGES.content.noCoverLetter
               }
          })
          throw new Error(ERROR_MESSAGES.content.noCoverLetter)
     }

     const hasCustomizations = (coverLetterValues.borderStyle && coverLetterValues.borderStyle!==existingCoverLetter?.borderStyle) || (coverLetterValues.colorHex && coverLetterValues.colorHex !== existingCoverLetter?.colorHex);

     if(hasCustomizations && !canUseCustomization){
          coverLetterValues.colorHex = undefined
          coverLetterValues.borderStyle = undefined
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
          if(existingCoverLetter?.profileImg){
               await del(existingCoverLetter.profileImg)
          }
          const blob = await put(`cl-photos/${path.extname(profileImg.name)}`,profileImg,{
               access: "public"
          });
          newImgUrl = blob.url
     } else if(profileImg===null){
          if(existingCoverLetter?.profileImg){
               await del(existingCoverLetter.profileImg)
          }
          newImgUrl = null;
     }

     if(id){
          await logAction({
               userId: user.id,
               action: "COVER_LETTER_UPDATED",
               metadata: {
                    ip: currIp,
                    coverLetterId: id
               }
          })
          return db.coverLetter.update({
               where: {id},
               data: {
                    ...coverLetterValues,
                    profileImg: newImgUrl,
                    createdAt: letterDate,
                    updatedAt: new Date()
               }
          })
     } else {
          const newCoverLetter = await db.coverLetter.create({
               data: {
                    ...coverLetterValues,
                    profileImg: newImgUrl,
                    createdAt: letterDate,
                    title: coverLetterValues.title || "Անանուն նամակ",
                    userId: user.id,
                    updatedAt: new Date()
               }
          })
          await logAction({
               userId: user.id,
               action: "COVER_LETTER_CREATED",
               metadata: { ip: currIp, coverLetterId: newCoverLetter.id }
          })
          return newCoverLetter
     }
}