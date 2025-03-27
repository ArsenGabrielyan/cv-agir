import { ResumeArrayFieldProps } from "@/data/types"
import { ResumeDetailsType } from "@/schemas/types"
import { FieldValues, Path } from "react-hook-form"
import DynamicFieldWrapper from "../wrappers/resume-dynamic-field-wrapper";
import { FormField, FormItem, FormMessage, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RandomPlaceholderInput } from "@/components/form/rand-placeholder-input";

export default function EducationField<TSchema extends FieldValues = ResumeDetailsType>({form,index,remove,id}: ResumeArrayFieldProps<TSchema>){
     const schoolField = `education.${index}.school` as Path<TSchema>;
     const degreeField = `education.${index}.degree` as Path<TSchema>;
     const facultyField = `education.${index}.faculty` as Path<TSchema>;
     const cityField = `education.${index}.city` as Path<TSchema>;
     const startDateField = `education.${index}.startDate` as Path<TSchema>
     const endDateField = `education.${index}.endDate` as Path<TSchema>
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
                         name={schoolField}
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
                         name={degreeField}
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
                         name={facultyField}
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
               <FormDescription>Թողնել <span className="font-semibold">նշված ավարտի ամիսը</span> դատարկ, եթե դեռ հիմա նշված տեղում սովորում եք</FormDescription>
          </DynamicFieldWrapper>
     )
}