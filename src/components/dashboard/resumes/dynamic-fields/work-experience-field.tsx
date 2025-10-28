import { ResumeArrayFieldProps } from "@/lib/types"
import { ResumeDetailsType } from "@/schemas/types"
import DynamicFieldWrapper from "../../wrappers/field-wrapper"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RandomPlaceholderInput } from "@/components/form/rand-placeholder-input"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import GenerateWorkExpButton from "../ai-buttons/generate-work-experience"

export default function WorkExperienceField({form,index,remove,id}: ResumeArrayFieldProps<ResumeDetailsType>){
     return (
          <DynamicFieldWrapper
               title="Աշխատանքային փորձ"
               index={index}
               remove={remove}
               id={id}
          >
               <div className="flex justify-center items-center">
                    <GenerateWorkExpButton
                         onWorkExpGenerated={exp=>form.setValue(`experience.${index}`,exp)}
                    />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name={`experience.${index}.job`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Մասնագիտություն</FormLabel>
                                   <FormControl>
                                        <RandomPlaceholderInput
                                             {...field}
                                             value={typeof field.value === 'string' ? field.value : ''}
                                             placeholderKey="jobName"
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={`experience.${index}.company`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Ընկերություն</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             value={typeof field.value === 'string' ? field.value : ''}
                                             placeholder="Ինչ-որ ընկերություն"
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name={`experience.${index}.startDate`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Սկիզբ</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             type="date"
                                             value={typeof field.value === 'string' ? field.value.slice(0, 10) : ''}
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={`experience.${index}.endDate`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Ավարտ</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             type="date"
                                             value={typeof field.value === 'string' ? field.value.slice(0, 10) : ''}
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
               </div>
               <FormDescription>Թողնել <span className="font-semibold">նշված ավարտի ամիսը</span> դատարկ, եթե դեռ հիմա նշված տեղում աշխատում եք</FormDescription>
               <FormField
                    control={form.control}
                    name={`experience.${index}.city`}
                    render={({field})=>(
                         <FormItem>
                              <FormLabel>Քաղաք, Երկիր</FormLabel>
                              <FormControl>
                                   <Input
                                        {...field}
                                        value={typeof field.value === 'string' ? field.value : ''}
                                        placeholder="Երևան, Հայաստան"
                                   />
                              </FormControl>
                              <FormMessage/>
                         </FormItem>
                    )}
               />
               <FormField
                    control={form.control}
                    name={`experience.${index}.jobInfo`}
                    render={({field})=>(
                         <FormItem>
                              <FormLabel>Նկարագրություն</FormLabel>
                              <FormControl>
                                   <Textarea
                                        {...field}
                                        cols={5}
                                        value={typeof field.value === 'string' ? field.value : ''}
                                        placeholder="Ստեղծել եմ վեբ կայքեր՝ օգտագործելով HTML, CSS և JavaScript։"
                                   />
                              </FormControl>
                              <FormDescription>Նկարագրել այս աշխատանքային փորձի մասին տեղեկություն։ Այն օգտագործում է Markdown</FormDescription>
                              <FormMessage/>
                         </FormItem>
                    )}
               />
          </DynamicFieldWrapper>
     )
}