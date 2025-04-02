"use client"
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { ResumeSettingsSchema } from "@/schemas/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingButton from "@/components/loading-button";
import { applyResumeDefaultsSettings } from "@/actions/settings";
import {
     Form,
     FormField,
     FormControl,
     FormItem,
     FormLabel,
     FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormSuccess } from "@/components/form/form-success";
import { FormError } from "@/components/form/form-error";
import { RandomPlaceholderInput } from "@/components/form/rand-placeholder-input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeSettingsType } from "@/schemas/types";

export default function ResumeSettings(){
     const user = useCurrentUser();
     const {update} = useSession();
     const [isPending, startTransition] = useTransition();
     const [error, setError] = useState<string | undefined>("")
     const [success, setSuccess] = useState<string | undefined>("")

     const defaultSettings: ResumeSettingsType = {
          jobTitle: user?.jobTitle || undefined,
          phone: user?.phone || undefined,
          address: user?.address || undefined,
          summary: user?.summary || undefined,
          hobbies: user?.hobbies || undefined
     }

     const form = useForm<ResumeSettingsType>({
          resolver: zodResolver(ResumeSettingsSchema),
          defaultValues: defaultSettings
     })

     const onSubmit = (values: ResumeSettingsType) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               applyResumeDefaultsSettings(values)
               .then(data=>{
                    if(data.error){
                         setError(data.error)
                    }
                    if(data.success){
                         update();
                         setSuccess(data.success)
                    }
               })
               .catch(()=>setError("Վայ, մի բան սխալ տեղի ունեցավ"))
          })
     }

     const currData = form.watch();
     const isSameSettings = JSON.stringify(currData) === JSON.stringify(defaultSettings);
     return (
          <Form {...form}>
               <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Card>
                         <CardHeader>
                              <CardTitle>Սկզբնական արժեքներ</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <FormField
                                   control={form.control}
                                   name="jobTitle"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Մասնագիտություն</FormLabel>
                                             <FormControl>
                                                  <RandomPlaceholderInput
                                                       {...field}
                                                       disabled={isPending}
                                                       placeholderKey="jobName"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({field})=>(
                                             <FormItem>
                                                  <FormLabel>Հեռախոսահամար</FormLabel>
                                                  <FormControl>
                                                       <Input
                                                            {...field}
                                                            placeholder="(012) 34-56-78"
                                                            disabled={isPending}
                                                       />
                                                  </FormControl>
                                                  <FormMessage/>
                                             </FormItem>
                                        )}
                                   />
                                   <FormField
                                        control={form.control}
                                        name="address"
                                        render={({field})=>(
                                             <FormItem>
                                                  <FormLabel>Բնակության հասցե</FormLabel>
                                                  <FormControl>
                                                       <Input
                                                            {...field}
                                                            placeholder="12 Փողոցի անուն, Քաղաք, Երկիր"
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
                                   name="summary"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Նկարագրություն</FormLabel>
                                             <FormControl>
                                                  <Textarea
                                                       {...field}
                                                       placeholder="Նկարագրեք Ձեր մասին կարճ տեղեկություն"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   control={form.control}
                                   name="hobbies"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Հոբբիներ</FormLabel>
                                             <FormControl>
                                                  <Textarea
                                                       {...field}
                                                       placeholder="Նկարագրեք Ձեր սիրած հոբբիները այստեղ"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                         </CardContent>
                    </Card>
                    <LoadingButton type="submit" disabled={isSameSettings} loading={isPending}>Պահպանել</LoadingButton>
               </form>
          </Form>
     )
}