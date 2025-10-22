"use client"
import { useState, useTransition } from "react";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { ContactSchema } from "@/schemas";
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form/form-error";
import { submitContactForm } from "@/actions/contact-form";
import { Textarea } from "@/components/ui/textarea";
import { FormSuccess } from "./form-success";
import { ContactFormType } from "@/lib/types/schema";
import LoadingButton from "@/components/buttons/loading-button";
import { getCaptchaToken } from "@/lib/captcha";
import { ERROR_MESSAGES } from "@/lib/constants";

export default function ContactForm(){
     const [isPending, startTransition] = useTransition();
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const form = useForm<ContactFormType>({
          resolver: zodResolver(ContactSchema),
          defaultValues: {
               name: "",
               email: "",
               phone: "",
               subject: "",
               message: ""
          }
     });
     const handleSubmit = (values: ContactFormType) => {
          setError("");
          setSuccess("");
          startTransition(async()=>{
               try{
                    const token = await getCaptchaToken();
                    const data = await submitContactForm(token,values)
                    setError(data.error);
                    setSuccess(data.success);
               } catch (error) {
                    console.error(error)
                    setError(ERROR_MESSAGES.unknownError)
               }
          })
     }
     return (
          <Form {...form}>
               <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="space-y-4">
                         <FormField
                              control={form.control}
                              name="name"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Անուն Ազգանուն</FormLabel>
                                        <FormControl>
                                             <Input
                                                  {...field}
                                                  disabled={isPending}
                                                  placeholder="Պողոս Պողոսյան"
                                             />
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <FormField
                                   control={form.control}
                                   name="email"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Էլ․ փոստ</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       type="email"
                                                       disabled={isPending}
                                                       placeholder="name@example.com"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   control={form.control}
                                   name="phone"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Հեռախոսահամար</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       disabled={isPending}
                                                       placeholder="(012) 34-56-78"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                         </div>
                         <FormField
                              control={form.control}
                              name="subject"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Թեմա</FormLabel>
                                        <FormControl>
                                             <Input
                                                  {...field}
                                                  disabled={isPending}
                                                  placeholder="Թեմայի Անուն"
                                             />
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="message"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Հաղորդագրություն</FormLabel>
                                        <FormControl>
                                             <Textarea
                                                  {...field}
                                                  disabled={isPending}
                                                  placeholder="Գրեք հաղորդագրությունն այստեղ"
                                                  rows={5}
                                             />
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <FormError message={error}/>
                         <FormSuccess message={success}/>
                         <LoadingButton type="submit" loading={isPending}>Ուղարկել հաղորդագրություն</LoadingButton>
                    </div>
               </form>
          </Form>
     )
}