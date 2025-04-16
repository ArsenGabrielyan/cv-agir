import { CoverLetterInfoType } from "@/schemas/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { CoverLetterInfoSchema } from "@/schemas"
import {
     Form,
     FormField,
     FormItem,
     FormControl,
     FormLabel,
     FormMessage,
     FormDescription
} from "@/components/ui/form"
import EditorFormCardWrapper from "../../wrappers/card-wrapper"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useMemo, useRef } from "react"
import { RandomPlaceholderInput } from "@/components/form/rand-placeholder-input"
import { CoverLetterFormProps } from "@/data/types"
import { Button } from "@/components/ui/button"
import debounce from "lodash.debounce"

export default function CoverLetterInfoForm({coverLetterData, setCoverLetterData}: CoverLetterFormProps){
     const form = useForm<CoverLetterInfoType>({
          resolver: zodResolver(CoverLetterInfoSchema),
          defaultValues: {
               title: coverLetterData.title || "",
               description: coverLetterData.description || "",
               fname: coverLetterData.fname || "",
               lname: coverLetterData.lname || "",
               jobTitle: coverLetterData.jobTitle || "",
               phone: coverLetterData.phone || "",
               address: coverLetterData.address || "",
               email: coverLetterData.email || ""
          }
     })
     const debouncedUpdate = useMemo(()=>debounce(async(values: CoverLetterInfoType)=>{
          if(await form.trigger()){
               setCoverLetterData(prev=>({...prev, ...values}))
          }
     },100),[form, setCoverLetterData])
     const allValues = useWatch({control: form.control})
     useEffect(()=>{
          debouncedUpdate(allValues)
          return () => {
               debouncedUpdate.cancel();
          }
     },[allValues, debouncedUpdate])

     const imgInputRef = useRef<HTMLInputElement>(null);
     return (
          <Form {...form}>
               <form className="space-y-4">
                    <EditorFormCardWrapper title="Ուղեկցող նամակի ինֆորմացիա" description="Այս ինֆորմացիան նամակին ցույց չի տալիս">
                         <FormField
                              control={form.control}
                              name="title"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Նամակի անուն</FormLabel>
                                        <FormControl>
                                             <Input
                                                  {...field}
                                                  placeholder="Պրոֆեսիոնալ ուղեկցող նամակ"
                                                  autoFocus
                                             />
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="description"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Նամակի նկարագրություն</FormLabel>
                                        <FormControl>
                                             <Textarea
                                                  {...field}
                                                  placeholder="Հաջորդ աշխատանքի մասին նամակ"
                                             />
                                        </FormControl>
                                        <FormDescription>Նկարագրեք, թե այս ռեղյումեն ինչի համար է։</FormDescription>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                    </EditorFormCardWrapper>
                    <EditorFormCardWrapper title="Անձնական ինֆորմացիա" description="Տեղադրել Ձեր մասին ինֆորմացիան այստեղ">
                         <FormField
                              control={form.control}
                              name="profileImg"
                              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                              render={({field: {value,...fieldValues}})=>(
                                   <FormItem>
                                        <FormLabel>Ձեր նկարը</FormLabel>
                                        <div className="flex items-center gap-2">
                                             <FormControl>
                                                  <Input
                                                       {...fieldValues}
                                                       type="file"
                                                       accept="image/*"
                                                       onChange={e=>{
                                                            const file = e.target.files?.[0];
                                                            fieldValues.onChange(file)
                                                       }}
                                                       ref={imgInputRef}
                                                  />
                                             </FormControl>
                                             <Button
                                                  type="button"
                                                  variant="secondary"
                                                  onClick={()=>{
                                                       fieldValues.onChange(null)
                                                       if(imgInputRef.current) {
                                                            imgInputRef.current.value = ""
                                                       }
                                                  }}
                                             >Հեռացնել</Button>
                                        </div>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                   control={form.control}
                                   name="fname"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Անուն</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       placeholder="Պողոս"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   control={form.control}
                                   name="lname"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Ազգանուն</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       placeholder="Պողոսյան"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                         </div>
                         <FormField
                              control={form.control}
                              name="jobTitle"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Մասնագիտություն</FormLabel>
                                        <FormControl>
                                             <RandomPlaceholderInput
                                                  {...field}
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
                                                       placeholder="012-34-56-78"
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
                                                       placeholder="12 Փողոց, Քաղաք, Երկիր"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                         </div>
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
                                             />
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                    </EditorFormCardWrapper>
               </form>
          </Form>         
     )
}