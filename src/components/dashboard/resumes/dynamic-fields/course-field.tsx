import { ResumeArrayFieldProps } from "@/data/types"
import { ResumeOptionalDetailsType } from "@/data/types/schema"
import DynamicFieldWrapper from "../../wrappers/field-wrapper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function ResumeCourseField({form,index,remove,id}: ResumeArrayFieldProps<ResumeOptionalDetailsType>){
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
                         name={`courses.${index}.name`}
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
                         name={`courses.${index}.institution`}
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
                         name={`courses.${index}.startDate`}
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
                         name={`courses.${index}.endDate`}
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