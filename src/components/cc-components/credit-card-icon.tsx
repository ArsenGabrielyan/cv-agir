import { CREDIT_CARD_BRANDS } from "@/data/constants/other"
import {FaCcVisa, FaCreditCard, FaCcMastercard, FaCcAmex, FaCcDiscover, FaCcDinersClub, FaCcJcb} from "react-icons/fa6"
import {Arca, Mir, UnionPay} from "@/components/settings/premium/other-credit-card-icons"

interface CreditCardIconProps{
     readonly value?: string,
     readonly brand?: string
}
export default function CreditCardIcon({value, brand}: CreditCardIconProps) {
     if(brand && brand!== ""){
          return brand==="Visa" ? (
               <FaCcVisa className="size-11"/>
          ) : brand==="Mastercard" ? (
               <FaCcMastercard className="size-11"/>
          ) : brand==="American Express" ? (
               <FaCcAmex className="size-11"/>
          ) : brand==="Mir" ? (
               <Mir className="size-11"/>
          ) : brand==="Discover" ? (
               <FaCcDiscover className="size-11"/>
          ) : brand==="Diners Club" ? (
               <FaCcDinersClub className="size-11"/>
          ) : brand==="JCB" ? (
               <FaCcJcb className="size-11"/>
          ) : brand==="Union Pay" ? (
               <UnionPay className="size-11"/>
          ) : brand==="ArCa" ? (
               <Arca className="size-11"/>
          ) : (
               <FaCreditCard className="size-11"/>
          )
     }
     if(value && value!=="") {
          const {visa, mastercard, amex, mir, discover, diners, jcb, unionPay, arca} = CREDIT_CARD_BRANDS
          return visa.test(value) ? (
               <FaCcVisa className="size-11"/>
          ) : mastercard.test(value) ? (
               <FaCcMastercard className="size-11"/>
          ) : amex.test(value) ? (
               <FaCcAmex className="size-11"/>
          ) : mir.test(value) ? (
               <Mir className="size-11"/>
          ) : discover.test(value) ? (
               <FaCcDiscover className="size-11"/>
          ) : diners.test(value) ? (
               <FaCcDinersClub className="size-11"/>
          ) : jcb.test(value) ? (
               <FaCcJcb className="size-11"/>
          ) : unionPay.test(value) ? (
               <UnionPay className="size-11"/>
          ) : arca.test(value) ? (
               <Arca className="size-11"/>
          ) : (
               <FaCreditCard className="size-11"/>
          )
     }
     return (
          <FaCreditCard className="size-11"/>
     )
}