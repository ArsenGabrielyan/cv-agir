"use client";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { AccountSettingsSchema } from "@/schemas/settings";
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
import { AccountSettingsType } from "@/data/types/schema";
import LoadingButton from "@/components/buttons/loading-button";
import SettingsCard from "../settings-card";
import { RandomPlaceholderInput } from "@/components/form/rand-placeholder-input";
import { Textarea } from "@/components/ui/textarea";

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
          jobTitle: user?.jobTitle || undefined,
          phone: user?.phone || undefined,
          address: user?.address || undefined,
          summary: user?.summary || undefined,
          hobbies: user?.hobbies || undefined,
          password: undefined,
          newPassword: undefined,
          showEmail: user?.cvPageSettings.showEmail || undefined,
          showPhone: user?.cvPageSettings.showPhone || undefined,
          showAddress: user?.cvPageSettings.showAddress || undefined,
          showLinks: user?.cvPageSettings.showLinks || undefined
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
                    <SettingsCard title="Հաշվի կարգավորումներ">
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
                    </SettingsCard>
                    <SettingsCard title="Փաստաթղթի արժեքներ" description="Այս կարգավորումները կիրառվում են ինչպես ռեզյումեի, այնպես էլ ուղեկցող նամակի տվյալների վրա։">
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
                    </SettingsCard>
                    <SettingsCard title="Գաղտնիություն">
                         <FormField
                              control={form.control}
                              name="showEmail"
                              render={({field})=>(
                                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                             <FormLabel>Ցույց տալ էլ․ հասցեն</FormLabel>
                                             <FormDescription>Ցուցադրել Ձեր էլ․ հասցեն Ձեր անձնական ռեզյումեի էջում</FormDescription>
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
                         <FormField
                              control={form.control}
                              name="showAddress"
                              render={({field})=>(
                                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                             <FormLabel>Ցույց տալ բնակության հասցեն</FormLabel>
                                             <FormDescription>Ցուցադրել Ձեր բնակության հասցեն Ձեր անձնական ռեզյումեի էջում</FormDescription>
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
                         <FormField
                              control={form.control}
                              name="showPhone"
                              render={({field})=>(
                                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                             <FormLabel>Ցույց տալ հեռախոսահամարը</FormLabel>
                                             <FormDescription>Ցուցադրել Ձեր հեռախոսահամարը Ձեր անձնական ռեզյումեի էջում</FormDescription>
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
                         <FormField
                              control={form.control}
                              name="showLinks"
                              render={({field})=>(
                                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                             <FormLabel>Ցույց տալ բոլոր վեբ հղումները</FormLabel>
                                             <FormDescription>Ցուցադրել Ձեր բոլոր վեբ հղումները Ձեր անձնական ռեզյումեի էջում</FormDescription>
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
                    </SettingsCard>
                    {!user?.isOauth && (
                         <SettingsCard title="Գաղտնաբառ և նույնականացում">
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
                         </SettingsCard>
                    )}
                    <LoadingButton type="submit" disabled={isSameSettings} loading={isPending}>Պահպանել</LoadingButton>
               </form>
          </Form>
     )
}