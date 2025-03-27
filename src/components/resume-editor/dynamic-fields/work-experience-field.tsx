import { ResumeArrayFieldProps } from "@/data/types"
import { ResumeDetailsType } from "@/schemas/types"
import { FieldValues, Path } from "react-hook-form"
import DynamicFieldWrapper from "../wrappers/resume-dynamic-field-wrapper"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RandomPlaceholderInput } from "@/components/form/rand-placeholder-input"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function WorkExperienceField<TSchema extends FieldValues = ResumeDetailsType>({form,index,remove,id}: ResumeArrayFieldProps<TSchema>){
     const jobField = `experience.${index}.job` as Path<TSchema>
     const companyField = `experience.${index}.company` as Path<TSchema>
     const startDateField = `experience.${index}.startDate` as Path<TSchema>
     const endDateField = `experience.${index}.endDate` as Path<TSchema>
     const cityField = `experience.${index}.city` as Path<TSchema>
     const jobInfoField = `experience.${index}.jobInfo` as Path<TSchema>
     return (
          <DynamicFieldWrapper
               title="Աշխատանքային փորձ"
               index={index}
               remove={remove}
               id={id}
          >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name={jobField}
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
                    <FormField
                         control={form.control}
                         name={companyField}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Ընկերություն</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
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
                         name={startDateField}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Սկիզբ</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             type="date"
                                             value={field.value?.slice(0,10)}
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={endDateField}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Ավարտ</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             type="date"
                                             value={field.value?.slice(0,10)}
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
                    name={cityField}
                    render={({field})=>(
                         <FormItem>
                              <FormLabel>Քաղաք, Երկիր</FormLabel>
                              <FormControl>
                                   <Input
                                        {...field}
                                        placeholder="Երևան, Հայաստան"
                                   />
                              </FormControl>
                              <FormMessage/>
                         </FormItem>
                    )}
               />
               <FormField
                    control={form.control}
                    name={jobInfoField}
                    render={({field})=>(
                         <FormItem>
                              <FormLabel>Նկարագրություն</FormLabel>
                              <FormControl>
                                   <Textarea
                                        {...field}
                                        cols={5}
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