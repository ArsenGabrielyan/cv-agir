import { ResumeArrayFieldProps } from "@/lib/types"
import { ResumeDetailsType } from "@/lib/types/schema"
import DynamicFieldWrapper from "../../wrappers/field-wrapper";
import { FormField, FormItem, FormMessage, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RandomPlaceholderInput } from "@/components/form/rand-placeholder-input";

export default function EducationField({form,index,remove,id}: ResumeArrayFieldProps<ResumeDetailsType>){
     return (
          <DynamicFieldWrapper
               title="Ուս․ Հաստատություն"
               index={index}
               remove={remove}
               id={id}
          >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name={`education.${index}.school`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Հաստատության անուն</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             placeholder="Երևանի Պետական Համալսարան"
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={`education.${index}.degree`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Գիտական աստիճան</FormLabel>
                                   <FormControl>
                                        <RandomPlaceholderInput
                                             {...field}
                                             placeholderKey="degrees"
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
                         name={`education.${index}.faculty`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Ֆակուլտետ</FormLabel>
                                   <FormControl>
                                        <Input {...field}/>
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name={`education.${index}.city`}
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
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name={`education.${index}.startDate`}
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
                         name={`education.${index}.endDate`}
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
               <FormDescription>Թողնել <span className="font-semibold">նշված ավարտի ամիսը</span> դատարկ, եթե դեռ հիմա նշված տեղում սովորում եք</FormDescription>
          </DynamicFieldWrapper>
     )
}