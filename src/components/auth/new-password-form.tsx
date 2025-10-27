"use client"
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { NewPasswordSchema } from "@/schemas";
import { CardWrapper } from "./card-wrapper";
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage
} from "@/components/ui/form"
import { FormError } from "@/components/form/form-error";
import { FormSuccess } from "@/components/form/form-success";
import { PasswordStrengthInput } from "@/components/form/password-input";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/auth/new-password";
import { NewPasswordType } from "@/lib/types/schema";
import LoadingButton from "@/components/buttons/loading-button";
import { useTranslations } from "next-intl";

export default function NewPasswordForm(){
     const [isPending, startTransition] = useTransition();
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const form = useForm<NewPasswordType>({
          resolver: zodResolver(NewPasswordSchema),
          defaultValues: {
               password: ''
          }
     });
     const searchParams = useSearchParams();
     const token = searchParams.get("token");
     const handleSubmit = (values: NewPasswordType) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               newPassword(values,token)
               .then(data=>{
                    setError(data?.error);
                    setSuccess(data?.success);
               })
          })
     }
     const t = useTranslations("auth");
     const formTxt = useTranslations("form")
     return (
          <CardWrapper
               headerLabel={t("new-password-title")}
               backButtonLabel={t("buttons.returnToLogin")}
               backButtonHref="/auth/login"
          >
               <Form {...form}>
                    <form
                         onSubmit={form.handleSubmit(handleSubmit)}
                         className="space-y-6"
                    >
                         <div className="space-y-4">
                              <FormField
                                   control={form.control}
                                   name="password"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>{formTxt("password-label")}</FormLabel>
                                             <FormControl>
                                                  <PasswordStrengthInput
                                                       {...field}
                                                       disabled={isPending}
                                                       placeholder="********"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                         </div>
                         <FormError message={error}/>
                         <FormSuccess message={success}/>
                         <LoadingButton type="submit" className="w-full" loading={isPending}>{t("buttons.reset-password")}</LoadingButton>
                    </form>
               </Form>
          </CardWrapper>
     )
}