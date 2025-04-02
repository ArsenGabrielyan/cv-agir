import { ResumeArrayFieldProps } from "@/data/types"
import { ResumeOptionalDetailsType } from "@/schemas/types"
import { FieldValues, Path } from "react-hook-form"
import DynamicFieldWrapper from "../wrappers/resume-dynamic-field-wrapper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function ResumeCourseField<TSchema extends FieldValues = ResumeOptionalDetailsType>({form,index,remove,id}: ResumeArrayFieldProps<TSchema>){
     const nameField = `courses.${index}.name` as Path<TSchema>
     const institutionField = `courses.${index}.institution` as Path<TSchema>
     const startDateField = `courses.${index}.startDate` as Path<TSchema>
     const endDateField = `courses.${index}.endDate` as Path<TSchema>
     return (
          <DynamicFieldWrapper
               title="Դասընթաց"
               index={index}
               remove={remove}
               id={id}
          >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name={nameField}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Դասընթացի անուն</FormLabel>
                                   <FormControl>
                                        <Input {...field}/>
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={institutionField}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Հաստատություն</FormLabel>
                                   <FormControl>
                                        <Input {...field}/>
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
          </DynamicFieldWrapper>
     )
}