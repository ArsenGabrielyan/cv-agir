import { ResumeArrayFieldProps } from "../../../../data/types"
import { ResumeDetailsType } from "@/schemas/types"
import { FieldValues, Path } from "react-hook-form"
import DynamicFieldWrapper from "../wrappers/resume-dynamic-field-wrapper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export default function SkillField<TSchema extends FieldValues = ResumeDetailsType>({form,index,remove,id}: ResumeArrayFieldProps<TSchema>){
     const nameField = `skills.${index}.name` as Path<TSchema>
     const percentageField = `skills.${index}.percentage` as Path<TSchema>
     return (
          <DynamicFieldWrapper
               title="Հմտություն"
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
                                   <FormLabel>Հմություն</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="Javascript"
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={percentageField}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Մակարդակ</FormLabel>
                                   <FormControl>
                                        <Slider
                                             min={0}
                                             max={100}
                                             step={1}
                                             defaultValue={[field.value]}
                                             onValueChange={vals=>field.onChange(vals[0])}
                                             className="h-9"
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