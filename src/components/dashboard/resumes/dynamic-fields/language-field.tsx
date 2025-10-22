import { ResumeArrayFieldProps } from "@/lib/types"
import { ResumeDetailsType } from "@/lib/types/schema"
import DynamicFieldWrapper from "../../wrappers/field-wrapper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export default function LanguageField({form,index,remove,id}: ResumeArrayFieldProps<ResumeDetailsType>){
     return (
          <DynamicFieldWrapper
               title="Լեզու"
               index={index}
               remove={remove}
               id={id}
          >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name={`languages.${index}.name`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Լեզվի անուն</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="Հայերեն"
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={`languages.${index}.percentage`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Մակարդակ</FormLabel>
                                   <FormControl>
                                        <Slider
                                             min={0}
                                             max={100}
                                             step={1}
                                             defaultValue={[field.value || 0]}
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