import { ResumeArrayFieldProps } from "@/lib/types"
import { ResumeOptionalDetailsType } from "@/lib/types/schema"
import DynamicFieldWrapper from "../../wrappers/field-wrapper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function ReferenceField({form,index,remove,id}: ResumeArrayFieldProps<ResumeOptionalDetailsType>){
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
                         name={`references.${index}.fullName`}
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
                         name={`references.${index}.position`}
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
                    name={`references.${index}.company`}
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
                         name={`references.${index}.phone`}
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
                         name={`references.${index}.email`}
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