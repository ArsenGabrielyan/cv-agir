import { FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FieldPath, FieldValues } from "react-hook-form"
import { ResumeArrayFieldProps } from "../../../../data/types"
import { ResumeOptionalDetailsType } from "@/schemas/types"
import DynamicFieldWrapper from "../wrappers/resume-dynamic-field-wrapper"

export default function ResumeLinkField<TSchema extends FieldValues = ResumeOptionalDetailsType>({form,index,remove,id}: ResumeArrayFieldProps<TSchema>){
     const nameField = `links.${index}.name` as FieldPath<TSchema>
     const urlField = `links.${index}.url` as FieldPath<TSchema>
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
                         name={nameField}
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
                         name={urlField}
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