"use client"
import { CheckoutFormSchema } from "@/schemas";
import { CheckoutFormType } from "@/lib/types/schema";
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
import { ERROR_MESSAGES } from "@/lib/constants";

interface CheckoutFormProps{
     period: SubscriptionPeriod,
     price: number,
     plan: UserPlan
}
export default function CheckoutForm({period, price, plan}: CheckoutFormProps){
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const [isPending, startTransition] = useTransition();
     const router = useRouter();
     const form = useForm<CheckoutFormType>({
          resolver: zodResolver(CheckoutFormSchema),
          defaultValues: {
               email: "",
               cardNumber: "",
               expiryDate: "",
               cvv: "",
               cardName: "",
               city: ""
          }
     });
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
               .catch(()=>setError(ERROR_MESSAGES.unknownError))
          })
     }
     const currBank = getBankName(form.watch("cardNumber"));
     return (
          <Form {...form}>
               <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                         control={form.control}
                         name="email"
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Էլ․ հասցե</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             type="email"
                                             placeholder="name@example.com"
                                             disabled={isPending}
                                        />
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
                                   <FormLabel>Վարկային քարտի համար</FormLabel>
                                   <FormControl>
                                        <CreditCardInput
                                             {...field}
                                             disabled={isPending}
                                        />
                                   </FormControl>
                                   {currBank.title!=="" && (
                                        <FormDescription>Բանկ՝ {currBank.title}</FormDescription>
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
                                        <FormLabel>Քարտի ժամկետ</FormLabel>
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
                                   <FormLabel>Օգտատիրոջ անուն ազգանուն</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="Պետրոս Պողոսյան"
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
                                   <FormLabel>Օգտատիրոջ հասցեն</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="Երևան, Հայաստան"
                                             disabled={isPending}
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <LoadingButton type="submit" className="w-full" loading={isPending}>Բաժանորդագրվել</LoadingButton>
               </form>
          </Form>
     )
}