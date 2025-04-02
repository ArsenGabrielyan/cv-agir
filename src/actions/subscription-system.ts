"use server"
import { getUserById } from "@/data/db/user";
import { parseExpiryDate } from "@/data/helpers/other";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckoutFormSchema } from "@/schemas"
import { CheckoutFormType } from "@/schemas/types"

export const proceedToCheckout = async(values: CheckoutFormType) => {
     const user = await currentUser();
     if(!user || !user.id){
          return {error: "Այս օգտատերը նույնականացված չէ"}
     }
     const validatedFields = CheckoutFormSchema.safeParse(values);
     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վավերական չեն"}
     }
     const {email, cardNumber, expiryDate, cvv, cardName, city} = validatedFields.data;
     const existingUser = await db.user.findFirst({
          where: {
               email,
               id: user.id
          }
     });
     if(!existingUser){
          return {error: 'Այս օգտատերը գրանցված չէ'}
     }
     const expires = parseExpiryDate(expiryDate);
     if(expires.error){
          return {error: expires.error}
     }
     if(expires.date){
          await db.user.update({
               where: {
                    email,
                    id: user.id
               },
               data: {
                    currentPlan: "premium",
                    creditCard: {
                         cardNumber,
                         expiryDate: expires.date,
                         cvv,
                         fullName: cardName,
                         city
                    }
               }
          })
          return {success: 'Խնդրում ենք սպասել․․․'}
     }
     return {error: "Քարտի ժամկետը պարտադիր է"}
}

export const getSubscriptionLevel = async(userId: string) => {
     const user = await getUserById(userId);
     if(!user){
          throw new Error("Այս օգտագործողը նույնականացված չէ։")
     }
     if(!user.currentPlan){
          throw new Error("Այսպիսի տարբերակ գոյություն չունի։")
     }
     return user.currentPlan
}