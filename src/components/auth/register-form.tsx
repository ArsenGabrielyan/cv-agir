"use client"
import { useState, useTransition } from "react";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { RegisterSchema } from "@/schemas";
import { CardWrapper } from "./card-wrapper";
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form/form-error";
import { FormSuccess } from "../form/form-success";
import { register } from "@/actions/auth/register";
import { PasswordStrengthInput } from "../form/password-input";
import { RegisterFormType } from "@/schemas/types";

export default function RegisterForm(){
     const [isPending, startTransition] = useTransition();
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const form = useForm<RegisterFormType>({
          resolver: zodResolver(RegisterSchema),
          defaultValues: {
               name: "",
               email: "",
               password: ""
          }
     });
     const handleSubmit = (values: RegisterFormType) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               register(values)
               .then(data=>{
                    setError(data.error);
                    setSuccess(data.success);
               })
          })
     }
     return (
          <CardWrapper
               headerLabel="Ստեղծել հաշիվ"
               backButtonLabel="Արդեն ունե՞ք հաշիվ։"
               backButtonHref="/auth/login"
               showSocial
          >
               <Form {...form}>
                    <form
                         onSubmit={form.handleSubmit(handleSubmit)}
                         className="space-y-6"
                    >
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
                                                       placeholder="Պողոս Պետրոսյան"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   control={form.control}
                                   name="email"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Էլ․ փոստ</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       disabled={isPending}
                                                       placeholder="name@example.com"
                                                       type="email"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   control={form.control}
                                   name="password"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Գաղտնաբառ</FormLabel>
                                             <FormControl>
                                                  <PasswordStrengthInput
                                                       {...field}
                                                       placeholder="********"
                                                       disabled={isPending}
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                         </div>
                         <FormError message={error}/>
                         <FormSuccess message={success}/>
                         <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Խնդրում ենք սպասել..." : "Գրանցվել"}</Button>
                    </form>
               </Form>
          </CardWrapper>
     )
}