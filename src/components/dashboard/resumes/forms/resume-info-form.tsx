import { ResumeInfoType } from "@/data/types/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import {ResumeInfoSchema} from "@/schemas"
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
import { ResumeFormProps } from "@/data/types"
import { Button } from "@/components/ui/button"
import GenerateSummaryButton from "../ai-buttons/generate-summary"
import debounce from "lodash.debounce"

export default function ResumeInfoForm({resumeData, setResumeData,userData}: ResumeFormProps){
     const form = useForm<ResumeInfoType>({
          resolver: zodResolver(ResumeInfoSchema),
          defaultValues: {
               title: resumeData.title || "",
               description: resumeData.description || "",
               fname: resumeData.fname || (userData.name ? userData.name.split(" ")[0] : "") || "",
               lname: resumeData.lname || (userData.name ? userData.name.split(" ")[1] : "") || "",
               jobTitle: resumeData.jobTitle || userData.jobTitle || "",
               phone: resumeData.phone || userData?.phone || "",
               address: resumeData.address || userData.address || "",
               email: resumeData.email || userData.email || "",
               summary: resumeData.summary || userData.summary || "",
               hobbies: resumeData.hobbies || userData.hobbies || "",
               profileImg: resumeData.profileImg instanceof File ? resumeData.profileImg : undefined,
          }
     })
     const debouncedUpdate = useMemo(()=>debounce(async(values: ResumeInfoType)=>{
          if(await form.trigger()){
               setResumeData(prev=>{
                    const {profileImg: newImg, ...rest} = values
                    return ({
                         ...prev,
                         ...rest,
                         profileImg: !newImg ? prev.profileImg : newImg, 
                    })
               })
          }
     },200),[form,setResumeData])
     const allValues = useWatch({control: form.control})
     useEffect(()=>{
          debouncedUpdate(allValues)
          return () => {
               debouncedUpdate.cancel();
          }
     },[allValues, debouncedUpdate])

     const imgInputRef = useRef<HTMLInputElement>(null);
     const isDisabled = !resumeData.jobTitle && !resumeData.experience?.length && !resumeData.education?.length || !resumeData.skills?.length || !resumeData.languages?.length
     return (
          <Form {...form}>
               <form className="space-y-4">
                    <EditorFormCardWrapper title="Ռեզյումեի ինֆորմացիա" description="Այս ինֆորմացիան ռեզյումեին ցույց չի տալիս">
                         <FormField
                              control={form.control}
                              name="title"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Ռեզյումեի անուն</FormLabel>
                                        <FormControl>
                                             <Input
                                                  {...field}
                                                  placeholder="Իմ ընտիր ռեզյումե"
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
                                        <FormLabel>Ռեզյումեի նկարագրություն</FormLabel>
                                        <FormControl>
                                             <Textarea
                                                  {...field}
                                                  placeholder="Հաջորդ աշխատանքի մասին ռեզյումե"
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
                                                       setResumeData(prev=>({
                                                            ...prev,
                                                            profileImg: null
                                                       }))
                                                       if(imgInputRef.current) {
                                                            imgInputRef.current.value = ""
                                                       }
                                                  }}
                                                  disabled={!resumeData.profileImg}
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
                         <FormField
                              control={form.control}
                              name="summary"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Կարճ նկարագրություն</FormLabel>
                                        <FormControl>
                                             <Textarea
                                                  {...field}
                                                  placeholder="Նկարագրեք կարճ տեղեկություն Ձեր մասին"
                                             />
                                        </FormControl>
                                        <FormMessage/>
                                        <GenerateSummaryButton
                                             resumeData={resumeData}
                                             onSummaryGenerated={summary=>field.onChange(summary)}
                                             disabled={isDisabled}
                                        />
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
                                                  placeholder="Լուսանկարչություն, Ֆուտբոլ և այլն․․․"
                                             />
                                        </FormControl>
                                        <FormDescription>Լրացրեք Ձեր սիրած հոբբիները այստեղ</FormDescription>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                    </EditorFormCardWrapper>
               </form>
          </Form>         
     )
}