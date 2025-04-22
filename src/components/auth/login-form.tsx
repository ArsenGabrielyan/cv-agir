"use client"
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form"
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod"
import { LoginSchema } from "@/schemas";
import { CardWrapper } from "./card-wrapper";
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form/form-error";
import { FormSuccess } from "@/components/form/form-success";
import { login } from "@/actions/auth/login";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { LoginType } from "@/data/types/schema";
import LoadingButton from "@/components/buttons/loading-button";
import {REGEXP_ONLY_DIGITS} from "input-otp"

function getOAuthNotLinkedError(searchParams: ReadonlyURLSearchParams){
     const error = searchParams.get("error");
     if(error){
          return error.includes("OAuthAccountNotLinked") ? "Այս էլ․ փոստով արդեն կա հաշիվ, բայց այլ մուտքի մեթոդով։" : ""
     }
     return ""
}

export default function LoginForm(){
     const searchParams = useSearchParams();
     const callbackUrl = searchParams.get("callbackUrl")
     const urlError = getOAuthNotLinkedError(searchParams)
     const [showTwoFactor, setShowTwoFactor] = useState(false);
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const [isPending, startTransition] = useTransition();
     const form = useForm<LoginType>({
          resolver: zodResolver(LoginSchema),
          defaultValues: {
               email: "",
               password: ""
          }
     });
     const handleSubmit = (values: LoginType) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               login(values,callbackUrl)
               .then(data=>{
                    if(data?.error){
                         setError(data?.error);
                    }
                    if(data?.success){
                         form.reset();
                         setSuccess(data?.success);
                    }
                    if(data?.twoFactor){
                         setShowTwoFactor(true);
                    }
               })
               .catch(()=>setError("Վայ, մի բան սխալ տեղի ունեցավ"))
          })
     }
     return (
          <CardWrapper
               headerLabel="Բարի գալուստ"
               backButtonLabel="Չունե՞ք հաշիվ։"
               backButtonHref="/auth/register"
               showSocial
          >
               <Form {...form}>
                    <form
                         onSubmit={form.handleSubmit(handleSubmit)}
                         className="space-y-6"
                    >
                         <div className="space-y-4">
                              {!showTwoFactor && (
                                   <>
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
                                                            <Input
                                                                 {...field}
                                                                 placeholder="********"
                                                                 disabled={isPending}
                                                                 type="password"
                                                            />
                                                       </FormControl>
                                                       <Button size="sm" variant="link" asChild className="px-0 font-normal">
                                                            <Link href="/auth/reset">Մոռացե՞լ եք գաղտնաբառը։</Link>
                                                       </Button>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
                                   </>
                              )}
                              {showTwoFactor && (
                                   <FormField
                                        control={form.control}
                                        name="code"
                                        render={({field})=>(
                                             <FormItem>
                                                  <FormLabel>Վավերացման կոդ</FormLabel>
                                                  <FormControl>
                                                       <InputOTP
                                                            maxLength={6}
                                                            {...field}
                                                            disabled={isPending}
                                                            pattern={REGEXP_ONLY_DIGITS}
                                                       >
                                                            <InputOTPGroup className="max-w-md mx-auto">
                                                                 <InputOTPSlot index={0}/>
                                                                 <InputOTPSlot index={1}/>
                                                                 <InputOTPSlot index={2}/>
                                                                 <InputOTPSlot index={3}/>
                                                                 <InputOTPSlot index={4}/>
                                                                 <InputOTPSlot index={5}/>
                                                            </InputOTPGroup>
                                                       </InputOTP>
                                                  </FormControl>
                                                  <FormMessage/>
                                             </FormItem>
                                        )}
                                   />
                              )}
                         </div>
                         <FormError message={error || urlError}/>
                         <FormSuccess message={success}/>
                         <LoadingButton type="submit" className="w-full" loading={isPending}>{showTwoFactor ? 'Հաստատել' : "Մուտք"}</LoadingButton>
                    </form>
               </Form>
          </CardWrapper>
     )
}