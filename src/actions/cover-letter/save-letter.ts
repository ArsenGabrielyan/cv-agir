"use server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { CoverLetterFormSchema } from "@/schemas"
import { CoverLetterFormType } from "@/schemas/types"
import {del, put} from "@vercel/blob"
import path from "path"
import { getSubscriptionLevel } from "../subscription-system"
import { getAvailableFeatures } from "@/lib/permission"
import { getCurrentCoverLetterByUserId } from "@/data/db/cover-letters"

export const saveCoverLetter = async(values: CoverLetterFormType) => {
     const {id} = values

     const validatedFields = CoverLetterFormSchema.safeParse(values);
     if(!validatedFields.success){
          throw new Error("Բոլոր դաշտերը վալիդացրած չէն")
     }
     const {profileImg, letterDate, ...coverLetterValues} = validatedFields.data

     const user = await currentUser();

     if(!user || !user.id){
          throw new Error("Օգտագործողը նույնականացված չէ")
     }

     const subscriptionLevel = await getSubscriptionLevel(user.id);
     const {canCreateCoverLetters, canUseCustomization} = getAvailableFeatures(subscriptionLevel);

     if(!id && !canCreateCoverLetters){
          throw new Error("Անվճար բաժանորդագրության համար ուղեկցող նամակի հետ աշխատելը արգելնված է")
     }

     const existingCoverLetter = id ? await getCurrentCoverLetterByUserId(user.id,id) : null;

     if(id && !existingCoverLetter ){
          throw new Error("Ուղեկցոց նամակը չի գտնվել")
     }

     const hasCustomizations = (coverLetterValues.borderStyle && coverLetterValues.borderStyle!==existingCoverLetter?.borderStyle) || (coverLetterValues.colorHex && coverLetterValues.colorHex !== existingCoverLetter?.colorHex);

     if(hasCustomizations && !canUseCustomization){
          coverLetterValues.colorHex = undefined
          coverLetterValues.borderStyle = undefined
          throw new Error("Ամբողջական դիզայնի ձևափոխությունը այս բաժանորդագրությունում արգելված է")
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
          return db.coverLetter.create({
               data: {
                    ...coverLetterValues,
                    profileImg: newImgUrl,
                    createdAt: letterDate,
                    title: coverLetterValues.title || "Անանուն նամակ",
                    userId: user.id,
                    updatedAt: new Date()
               }
          })
     }
}