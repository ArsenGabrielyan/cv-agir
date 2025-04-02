"use client";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { AccountSettingsSchema } from "@/schemas/settings";
import {
     Card,
     CardHeader,
     CardTitle,
     CardContent
} from "@/components/ui/card";
import { applyAccountSettings } from "@/actions/settings";
import {
     Form,
     FormField,
     FormControl,
     FormItem,
     FormLabel,
     FormMessage,
     FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormSuccess } from "@/components/form/form-success";
import { FormError } from "@/components/form/form-error";
import { Switch } from "@/components/ui/switch";
import { AccountSettingsType } from "@/schemas/types";
import LoadingButton from "@/components/loading-button";

export default function AccountSettings(){
     const user = useCurrentUser();
     const {update} = useSession();
     const [isPending, startTransition] = useTransition();
     const [error, setError] = useState<string|undefined>("")
     const [success, setSuccess] = useState<string|undefined>("")

     const defaultSettings: AccountSettingsType = {
          name: user?.name || undefined,
          email: user?.email || undefined,
          isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
          password: undefined,
          newPassword: undefined
     }

     const form = useForm<AccountSettingsType>({
          resolver: zodResolver(AccountSettingsSchema),
          defaultValues: defaultSettings
     })

     const onSubmit = (values: AccountSettingsType) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               applyAccountSettings(values)
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
                              <CardTitle>Հաշվի կարգավորումներ</CardTitle>
                         </CardHeader>
                         <CardContent>
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
                                                            placeholder="Պողոս Պետրոսյան"
                                                            disabled={isPending}
                                                       />
                                                  </FormControl>
                                                  <FormMessage/>
                                             </FormItem>
                                        )}
                                   />
                                   {!user?.isOauth && (
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
                                   )}
                              </div>
                         </CardContent>
                    </Card>
                    {!user?.isOauth && (
                         <Card>
                              <CardHeader>
                                   <CardTitle>Գաղտնաբառ և նույնականացում</CardTitle>
                              </CardHeader>
                              <CardContent>
                                   <div className="space-y-4">
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
                                                                 type="password"
                                                                 disabled={isPending}
                                                            />
                                                       </FormControl>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={form.control}
                                             name="newPassword"
                                             render={({field})=>(
                                                  <FormItem>
                                                       <FormLabel>Նոր գաղտնաբառ</FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 {...field}
                                                                 placeholder="********"
                                                                 type="password"
                                                                 disabled={isPending}
                                                            />
                                                       </FormControl>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={form.control}
                                             name="isTwoFactorEnabled"
                                             render={({field})=>(
                                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                       <div className="space-y-0.5">
                                                            <FormLabel>Երկաստիճան վավերացում</FormLabel>
                                                            <FormDescription>Միացնել երկաստիճան վավերացումը հաշվի պաշտպանությունը ուժեղացնելու համար</FormDescription>
                                                            <FormMessage/>
                                                       </div>
                                                       <FormControl>
                                                            <Switch
                                                                 disabled={isPending}
                                                                 checked={field.value}
                                                                 onCheckedChange={field.onChange}
                                                            />
                                                       </FormControl>
                                                  </FormItem>
                                             )}
                                        />
                                   </div>
                              </CardContent>
                         </Card>
                    )}
                    <LoadingButton type="submit" disabled={isSameSettings} loading={isPending}>Պահպանել</LoadingButton>
               </form>
          </Form>
     )
}