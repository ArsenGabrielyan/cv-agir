import {CREDIT_CARD_BRANDS, GET_BANKS} from "@/lib/constants"
import { useTranslations } from "next-intl";

export const isValidCard = (card: string) => {
     let s = 0, isSecond = false
     for(let i=card.length-1;i>=0;i--){
          let digit = + card[i];
          if(isSecond){
               digit*=2;
               if(digit>9) digit-=9;
          }
          s+=digit;
          isSecond = !isSecond;
     }
     return s%10===0;
}

export const parseExpiryDate = (date: string, t: ReturnType<typeof useTranslations<"error-messages">>) : {
     error?: string,
     date?: Date
} => {
     const parts = date.split("/").map(val=>+val)
     if(parts.length!==2){
          return {error: t("subscription.invalidExpiryDate")}
     }
     const [month, year] = parts;
     if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
          throw new Error(t("subscription.invalidDate"));
     }
     const fullYear = year <= 50 ? 2000 + year : 1900 + year;

     return { date: new Date(fullYear,month,0) }
}

export const getCreditCardBrandName = (card: string) => {
     const {visa, mastercard, amex, mir, discover, diners, jcb, unionPay, arca} = CREDIT_CARD_BRANDS;
     if(visa.test(card)) return "Visa";
     if(mastercard.test(card)) return "Mastercard";
     if(amex.test(card)) return "American Express";
     if(mir.test(card)) return "Mir";
     if(discover.test(card)) return "Discover";
     if(diners.test(card)) return "Diners Club";
     if(jcb.test(card)) return "JCB"
     if(unionPay.test(card)) return "Union Pay";
     if(arca.test(card)) return "ArCa";
     return "Անհայտ քարտ"
}
export const getBankName = (card: string, aebName: string) => {
     const mentionedBank = GET_BANKS(aebName).find(val=>card.includes(val.startNumber));
     return {
          name: mentionedBank?.name || "",
          title: mentionedBank?.title || ""
     }
}