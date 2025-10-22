"use server"
import { parseExpiryDate } from "@/lib/helpers/credit-cards";
import { currentUser, CurrentUserReturnType } from "@/lib/auth";
import { db } from "@/lib/db";
import { decryptData, encryptData } from "@/actions/encryption";
import { CreditCardSchema } from "@/schemas"
import { CreditCardType } from "@/lib/types/schema"
import { CreditCard } from "@db";
import { ERROR_MESSAGES } from "@/lib/constants";
import { logAction } from "@/data/logs";
import { getIpAddress } from "@/lib/limiter";

export const upsertCard = async(values: CreditCardType, user: CurrentUserReturnType, expiryDate: Date) => {
     const creditCards: CreditCard[] = user.creditCards || [];
     const {cardName,cardNumber,city,cvv} = values
     let found = false;
     for(let i=0;i<creditCards.length;i++){
          const card = creditCards[i];
          const decrypted = await decryptData(card.cardNumber);
          if(decrypted===cardNumber){
               creditCards[i] = {
                    cardNumber: await encryptData(cardNumber),
                    cvv: await encryptData(cvv),
                    expiryDate,
                    fullName: cardName,
                    city
               }
               found = true;
               break;
          }
     }
     if(!found){
          creditCards.push({
               cardNumber: await encryptData(cardNumber),
               cvv: await encryptData(cvv),
               expiryDate,
               fullName: cardName,
               city
          })
     }
     return creditCards
}

export const addCard = async(values: CreditCardType) => {
     const currIp = await getIpAddress();
     const validatedFields = CreditCardSchema.safeParse(values);
     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(val=>val.path[0]),
               }
          })
          return {error: ERROR_MESSAGES.validationError}
     }
     const {expiryDate, cardNumber} = validatedFields.data
     const user = await currentUser();
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          return {error: ERROR_MESSAGES.auth.unauthorized}
     }
     const expires = parseExpiryDate(expiryDate);
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
          const creditCards = await upsertCard(values,user,expires.date);
          await logAction({
               userId: user.id,
               action: "CREDIT_CARD_ADDED",
               metadata: {
                    ip: currIp,
                    last4: cardNumber.slice(-4)
               }
          })
          await db.user.update({
               where: {
                    id: user.id
               },
               data: {
                    creditCards
               }
          })
     }
     return {success: true}
}

export const editCard = async (values: CreditCardType, index: number) => {
     const currIp = await getIpAddress();
     const validatedFields = CreditCardSchema.safeParse(values);
     if(!validatedFields.success){
          await logAction({
               action: "VALIDATION_ERROR",
               metadata: {
                    fields: validatedFields.error.issues.map(val=>val.path[0]),
               }
          })
          return {error: ERROR_MESSAGES.validationError}
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
          return {error: ERROR_MESSAGES.auth.unauthorized}
     }
     const expires = parseExpiryDate(expiryDate);
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
          const creditCards = [...user.creditCards];
          creditCards[index] = {
               cardNumber: await encryptData(cardNumber),
               cvv: await encryptData(cvv),
               expiryDate: expires.date,
               fullName: cardName,
               city
          }
          await logAction({
               userId: user.id,
               action: "CREDIT_CARD_UPDATED",
               metadata: {
                    ip: currIp,
                    last4: cardNumber.slice(-4)
               }
          })
          await db.user.update({
               where: {
                    id: user.id
               },
               data: {
                    creditCards
               }
          })
     }
     return {success: true}
}

export const deleteCard = async(index: number) => {
     const user = await currentUser();
     const currIp = await getIpAddress();
     if(!user || !user.id){
          await logAction({
               action: "UNAUTHORIZED",
               metadata: {
                    ip: currIp,
               }
          })
          return {error: ERROR_MESSAGES.auth.unauthorized}
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
                    reason: ERROR_MESSAGES.subscription.noCreditCard
               }
          })
          return {error: ERROR_MESSAGES.subscription.noCreditCard}
     }
     const creditCards = creditCard.creditCards.filter((_,i)=>i!==index);
     await db.user.update({
          where: {
               id: user.id
          },
          data: {
               creditCards
          }
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