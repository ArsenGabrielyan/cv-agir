import { ResumeArrayFieldProps } from "@/data/types"
import { ResumeOptionalDetailsType } from "@/schemas/types"
import { FieldValues, Path } from "react-hook-form"
import DynamicFieldWrapper from "../wrappers/resume-dynamic-field-wrapper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function ReferenceField<TSchema extends FieldValues = ResumeOptionalDetailsType>({form,index,remove,id}: ResumeArrayFieldProps<TSchema>){
     const fullNameField = `references.${index}.fullName` as Path<TSchema>
     const posField = `references.${index}.position` as Path<TSchema>
     const companyField = `references.${index}.company` as Path<TSchema>
     const phoneField = `references.${index}.phone` as Path<TSchema>
     const emailField = `references.${index}.email` as Path<TSchema>
     return (
          <DynamicFieldWrapper
               title="Կոնտակտային հղում"
               index={index}
               remove={remove}
               id={id}
          >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name={fullNameField}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Անուն Ազգանուն</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="Պետրոս Պետրոսյան"
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={posField}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Պաշտոն</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="Տնօրեն"
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
               </div>
               <FormField
                    control={form.control}
                    name={companyField}
                    render={({field})=>(
                         <FormItem>
                              <FormLabel>Ընկերություն</FormLabel>
                              <FormControl>
                                   <Input
                                        {...field}
                                        placeholder="Մեկ այլ ընկերություն"
                                   />
                              </FormControl>
                              <FormMessage/>
                         </FormItem>
                    )}
               />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name={phoneField}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Հեռախոսահամար</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="098-76-54-32"
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={emailField}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Էլ․ հասցե</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="headmaster@example.com"
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