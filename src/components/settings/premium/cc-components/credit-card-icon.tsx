import { CREDIT_CARD_BRANDS } from "@/lib/constants"
import {FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaCcDinersClub, FaCcJcb} from "react-icons/fa6"
import {BsCreditCard2Front} from "react-icons/bs"
import {Arca, Mir, UnionPay} from "@/components/settings/premium/cc-components/other-credit-card-icons"

interface CreditCardIconProps{
     readonly value?: string,
     readonly brand?: string
}
export default function CreditCardIcon({value, brand}: CreditCardIconProps) {
     const className = "size-11 text-primary"
     const otherIconClass = "size-11 fill-primary"
     if(brand && brand!== ""){
          return brand==="Visa" ? (
               <FaCcVisa className={className}/>
          ) : brand==="Mastercard" ? (
               <FaCcMastercard className={className}/>
          ) : brand==="American Express" ? (
               <FaCcAmex className={className}/>
          ) : brand==="Mir" ? (
               <Mir className={otherIconClass}/>
          ) : brand==="Discover" ? (
               <FaCcDiscover className={className}/>
          ) : brand==="Diners Club" ? (
               <FaCcDinersClub className={className}/>
          ) : brand==="JCB" ? (
               <FaCcJcb className={className}/>
          ) : brand==="Union Pay" ? (
               <UnionPay className={otherIconClass}/>
          ) : brand==="ArCa" ? (
               <Arca className={otherIconClass}/>
          ) : (
               <BsCreditCard2Front className={className}/>
          )
     }
     if(value && value!=="") {
          const {visa, mastercard, amex, mir, discover, diners, jcb, unionPay, arca} = CREDIT_CARD_BRANDS
          return visa.test(value) ? (
               <FaCcVisa className={className}/>
          ) : mastercard.test(value) ? (
               <FaCcMastercard className={className}/>
          ) : amex.test(value) ? (
               <FaCcAmex className={className}/>
          ) : mir.test(value) ? (
               <Mir className={otherIconClass}/>
          ) : discover.test(value) ? (
               <FaCcDiscover className={className}/>
          ) : diners.test(value) ? (
               <FaCcDinersClub className={className}/>
          ) : jcb.test(value) ? (
               <FaCcJcb className={className}/>
          ) : unionPay.test(value) ? (
               <UnionPay className={otherIconClass}/>
          ) : arca.test(value) ? (
               <Arca className={otherIconClass}/>
          ) : (
               <BsCreditCard2Front className={className}/>
          )
     }
     return (
          <BsCreditCard2Front className={className}/>
     )
}