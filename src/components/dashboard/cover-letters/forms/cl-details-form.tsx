import { CoverLetterFormProps } from "@/lib/types";
import { CoverLetterDetailsType } from "@/lib/types/schema";
import { CoverLetterDetailsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import {
     Form,
     FormField,
     FormItem,
     FormControl,
     FormLabel,
     FormMessage,
     FormDescription
} from "@/components/ui/form"
import EditorFormCardWrapper from "../../wrappers/card-wrapper"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useMemo } from "react"
import GenerateLetterBodyButton from "../ai-generate-body";
import debounce from "lodash.debounce";

export default function CoverLetterDetailsForm({coverLetterData, setCoverLetterData}: CoverLetterFormProps){
     const form = useForm<CoverLetterDetailsType>({
          resolver: zodResolver(CoverLetterDetailsSchema),
          defaultValues: {
               recipientName: coverLetterData.recipientName || "",
               recipientTitle: coverLetterData.recipientTitle || "",
               companyName: coverLetterData.companyName || "",
               companyAddress: coverLetterData.companyAddress || "",
               letterContent: coverLetterData.letterContent || "",
          }
     })
     const debouncedUpdate = useMemo(()=>debounce(async(values: CoverLetterDetailsType)=>{
          if(await form.trigger()){
               setCoverLetterData(prev=>({...prev, ...values}))
          }
     },200),[form, setCoverLetterData])
     const allValues = useWatch({control: form.control})
     useEffect(()=>{
          debouncedUpdate(allValues)
          return () => {
               debouncedUpdate.cancel();
          }
     },[allValues, debouncedUpdate])
     return (
          <Form {...form}>
               <form className="space-y-4">
                    <EditorFormCardWrapper title="Գործատուի մասին ինֆորմացիա" description="Տեղադրել գործատուի մասին ինֆորմացիան այստեղ">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                   control={form.control}
                                   name="recipientName"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Գործատուի անուն, ազգանուն</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       placeholder="Կիրակոս Պետրոսյան"
                                                       autoFocus
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   control={form.control}
                                   name="recipientTitle"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Գործատուի պաշտոն</FormLabel>
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
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                   control={form.control}
                                   name="companyName"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Ընկերության անուն</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       placeholder="Ինչ-որ ընկերություն ՍՊԸ"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   control={form.control}
                                   name="companyAddress"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Ընկերության հասցե</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       placeholder="12 փողոց, Քաղաք, Երկիր"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                         </div>
                         <FormField
                              control={form.control}
                              name="letterContent"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Նամակի բովանդակություն</FormLabel>
                                        <FormControl>
                                             <Textarea
                                                  {...field}
                                                  placeholder="Հարգելի Կիրակոս Թադևոսյան։ ..."
                                             />
                                        </FormControl>
                                        <GenerateLetterBodyButton
                                             coverLetterData={coverLetterData}
                                             onBodyGenerated={letterContent=>field.onChange(letterContent)}
                                        />
                                        <FormDescription>Այն օգտագործվում է Markdown ֆորմատավորման համար</FormDescription>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                    </EditorFormCardWrapper>
               </form>
          </Form>
     )
}