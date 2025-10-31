"use client"
import { getCheckoutFormSchema } from "@/schemas";
import { CheckoutFormType } from "@/schemas/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { FormError } from "@/components/form/form-error";
import { FormSuccess } from "@/components/form/form-success";
import { proceedToCheckout } from "@/actions/subscription-system";
import { useRouter } from "@/i18n/routing";
import LoadingButton from "@/components/buttons/loading-button";
import { SubscriptionPeriod, UserPlan } from "@db";
import CreditCardInput from "@/components/form/credit-card-input";
import { getBankName } from "@/lib/helpers/credit-cards";
import { useTranslations } from "next-intl";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {MailIcon, MapPinIcon} from "lucide-react"

interface CheckoutFormProps{
     period: SubscriptionPeriod,
     price: number,
     plan: UserPlan,
     aebName: string
}
export default function CheckoutForm({period, price, plan, aebName}: CheckoutFormProps){
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const [isPending, startTransition] = useTransition();
     const router = useRouter();
     const validationMsg = useTranslations("validations");
     const form = useForm<CheckoutFormType>({
          resolver: zodResolver(getCheckoutFormSchema(validationMsg)),
          defaultValues: {
               email: "",
               cardNumber: "",
               expiryDate: "",
               cvv: "",
               cardName: "",
               city: ""
          }
     });
     const errMsg = useTranslations("error-messages")
     const handleSubmit = (values: CheckoutFormType) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               proceedToCheckout(values,period,price,plan)
               .then(data=>{
                    if(data.error){
                         setError(data.error);
                    }
                    if(data.success){
                         setSuccess(data.success);
                         router.push("/billing-success");
                    }
               })
               .catch(()=>setError(errMsg("unknownError")))
          })
     }
     const currBank = getBankName(form.watch("cardNumber"),aebName);
     const formTxt = useTranslations("form");
     const buttonTxt = useTranslations("buttons")
     return (
          <Form {...form}>
               <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                         control={form.control}
                         name="email"
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>{formTxt("email.label")}</FormLabel>
                                   <FormControl>
                                        <InputGroup>
                                             <InputGroupInput
                                                  {...field}
                                                  type="email"
                                                  placeholder={formTxt("email.placeholder")}
                                                  disabled={isPending}
                                             />
                                             <InputGroupAddon>
                                                  <MailIcon/>
                                             </InputGroupAddon>
                                        </InputGroup>
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name="cardNumber"
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>{formTxt("credit-card-num.label")}</FormLabel>
                                   <FormControl>
                                        <CreditCardInput
                                             {...field}
                                             disabled={isPending}
                                        />
                                   </FormControl>
                                   {currBank.title!=="" && (
                                        <FormDescription>{formTxt("credit-card-num.desc",{
                                             bankTitle: currBank.title
                                        })}</FormDescription>
                                   )}
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>{formTxt("expiry-date-label")}</FormLabel>
                                        <FormControl>
                                             <Input
                                                  {...field}
                                                  placeholder="MM/YY"
                                                  maxLength={5}
                                                  disabled={isPending}
                                             />
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="cvv"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>CVV</FormLabel>
                                        <FormControl>
                                             <Input
                                                  {...field}
                                                  placeholder="123"
                                                  maxLength={4}
                                                  disabled={isPending}
                                             />
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                    </div>
                    <FormField
                         control={form.control}
                         name="cardName"
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>{formTxt("cardholder-name.label")}</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder={formTxt("cardholder-name.placeholder")}
                                             disabled={isPending}
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name="city"
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>{formTxt("cardholder-address.label")}</FormLabel>
                                   <FormControl>
                                        <InputGroup>
                                             <InputGroupInput
                                                  {...field}
                                                  placeholder={formTxt("cardholder-address.placeholder")}
                                                  disabled={isPending}
                                             />
                                             <InputGroupAddon>
                                                  <MapPinIcon/>
                                             </InputGroupAddon>
                                        </InputGroup>
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <LoadingButton type="submit" className="w-full" loading={isPending}>{buttonTxt("subscribe-btn")}</LoadingButton>
               </form>
          </Form>
     )
}