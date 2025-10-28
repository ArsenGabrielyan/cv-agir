import { FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ResumeArrayFieldProps } from "@/lib/types"
import { ResumeOptionalDetailsType } from "@/schemas/types"
import DynamicFieldWrapper from "../../wrappers/field-wrapper"

export default function ResumeLinkField({form,index,remove,id}: ResumeArrayFieldProps<ResumeOptionalDetailsType>){
     return (
          <DynamicFieldWrapper
               title="Վեբ հղում"
               index={index}
               remove={remove}
               id={id}
          >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name={`links.${index}.name`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Հղում</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="Վեբ կայք"
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={`links.${index}.url`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Հղման հասցե</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="https://example.com"
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