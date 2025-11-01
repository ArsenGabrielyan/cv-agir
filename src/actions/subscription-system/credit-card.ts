"use server"
import { parseExpiryDate } from "@/lib/helpers/credit-cards";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { encryptData } from "@/actions/encryption";
import { getCreditCardSchema } from "@/schemas"
import { CreditCardType } from "@/schemas/types"
import { logAction } from "@/data/logs";
import { getIpAddress } from "@/actions/ip";
import { getTranslations } from "next-intl/server";

export const addCard = async(values: CreditCardType) => {
     const currIp = await getIpAddress();
     const validationMsg = await getTranslations("validations");
     const validatedFields = getCreditCardSchema(validationMsg).safeParse(values);
     const errMsg = await getTranslations("error-messages");
     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(val=>val.path[0]),
               }
          })
          return {error: errMsg("validationError")}
     }
     const {expiryDate, cardNumber, cvv, city, cardName} = validatedFields.data
     const user = await currentUser();
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          return {error: errMsg("auth.unauthorized")}
     }
     const expires = parseExpiryDate(expiryDate,errMsg);
     if(expires.error){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: expires.error
               }
          })
          return {error: expires.error}
     }
     if(expires.date){
          await logAction({
               userId: user.id,
               action: "CREDIT_CARD_ADDED",
               metadata: {
                    ip: currIp,
                    last4: cardNumber.slice(-4)
               }
          })
          await db.user.update({
               where: { id: user.id },
               data: {
                    creditCards: {
                         create: {
                              cardNumber: await encryptData(cardNumber),
                              cvv: await encryptData(cvv),
                              expiryDate: expires.date,
                              fullName: cardName,
                              city: city
                         }
                    }
               }
          })
     }
     return {success: true}
}

export const editCard = async (values: CreditCardType) => {
     const currIp = await getIpAddress();
     const validationMsg = await getTranslations("validations");
     const validatedFields = getCreditCardSchema(validationMsg).safeParse(values);
     const errMsg = await getTranslations("error-messages");
     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(val=>val.path[0]),
               }
          })
          return {error: errMsg("validationError")}
     }
     const {cardName,cardNumber,city,cvv,expiryDate} = validatedFields.data
     const user = await currentUser();
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          return {error: errMsg("auth.unauthorized")}
     }
     const expires = parseExpiryDate(expiryDate,errMsg);
     if(expires.error){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: expires.error
               }
          })
          return {error: expires.error}
     }
     if(expires.date){
          await logAction({
               userId: user.id,
               action: "CREDIT_CARD_UPDATED",
               metadata: {
                    ip: currIp,
                    last4: cardNumber.slice(-4)
               }
          })
          await db.user.update({
               where: { id: user.id },
               data: {
                    creditCards: {
                         deleteMany: {},
                         create: {
                              cardNumber: await encryptData(cardNumber),
                              cvv: await encryptData(cvv),
                              expiryDate: expires.date,
                              fullName: cardName,
                              city
                         }
                    }
               }
          })
     }
     return {success: true}
}

export const deleteCard = async(index: number) => {
     const user = await currentUser();
     const currIp = await getIpAddress();
     const errMsg = await getTranslations("error-messages");
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          return {error: errMsg("auth.unauthorized")}
     }
     const creditCard = await db.user.findUnique({
          where: {
               id: user.id
          },
          select: {
               creditCards: true
          }
     })
     if(!creditCard || !creditCard.creditCards[index]){
          await logAction({
               userId: user.id,
               action: "ACTION_ERROR",
               metadata: {
                    ip: currIp,
                    reason: errMsg("subscription.noCreditCard")
               }
          })
          return {error: errMsg("subscription.noCreditCard")}
     }
     const creditCards = creditCard.creditCards.filter((_,i)=>i!==index);
     await db.creditCard.updateMany({
          where: {
               id: user.id
          },
          data: creditCards
     })
     await logAction({
          userId: user.id,
          action: "CREDIT_CARD_DELETED",
          metadata: {
               ip: currIp
          }
     })
     return {success: true}
}