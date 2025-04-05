"use server"
import { parseExpiryDate } from "@/data/helpers/other";
import { currentUser, CurrentUserReturnType } from "@/lib/auth";
import { db } from "@/lib/db";
import { decryptData, encryptData } from "@/actions/encryption";
import { CreditCardSchema } from "@/schemas"
import { CreditCardType } from "@/schemas/types"
import { CreditCard } from "@prisma/client";

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
     const validatedFields = CreditCardSchema.safeParse(values);
     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդ չեն"}
     }
     const {expiryDate} = validatedFields.data
     const user = await currentUser();
     if(!user || !user.id){
          return {error: "Այս օգտատերը նույնականացված չէ։"}
     }
     const expires = parseExpiryDate(expiryDate);
     if(expires.error){
          return {error: expires.error}
     }
     if(expires.date){
          const creditCards = await upsertCard(values,user,expires.date);
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
     const validatedFields = CreditCardSchema.safeParse(values);
     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդ չեն"}
     }
     const {cardName,cardNumber,city,cvv,expiryDate} = validatedFields.data
     const user = await currentUser();
     if(!user || !user.id){
          return {error: "Այս օգտատերը նույնականացված չէ։"}
     }
     const expires = parseExpiryDate(expiryDate);
     if(expires.error){
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
     if(!user || !user.id){
          return {error: "Այս օգտատերը նույնականացված չէ։"}
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
          return {error: "Այսպիսի քարտ գոյություն չունի։"}
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
     return {success: true}
}