import { generateWorkExperience } from "@/actions/ai";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { GenerateDescriptionSchema } from "@/schemas/ai";
import { GenerateDescriptionInput, WorkExperienceType } from "@/schemas/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface GenerateWorkExpButtonProps{
     onWorkExpGenerated: (exp: WorkExperienceType) => void
}
export default function GenerateWorkExpButton({onWorkExpGenerated}: GenerateWorkExpButtonProps){
     const [showInputDialog, setShowInputDialog] = useState(false);
     return (
          <>
               {/* TODO: Block For Free Users */}
               <Button variant="outline" type="button" onClick={()=>setShowInputDialog(true)}>
                    <Sparkles className="size-4"/>
                    Խելացի լրացում (ԱԲ)
               </Button>
               <InputDialog
                    open={showInputDialog}
                    onOpenChange={setShowInputDialog}
                    onWorkExpGenerated={exp=>{
                         onWorkExpGenerated(exp);
                         setShowInputDialog(false);
                    }}
               />
          </>
     )
}
interface InputDialogProps{
     open: boolean,
     onOpenChange: (open: boolean) => void
     onWorkExpGenerated: (exp: WorkExperienceType) => void
}
function InputDialog({open,onOpenChange,onWorkExpGenerated}: InputDialogProps){
     const form = useForm<GenerateDescriptionInput>({
          resolver: zodResolver(GenerateDescriptionSchema),
          defaultValues: {
               description: ""
          }
     });

     const handleSubmit = async (input: GenerateDescriptionInput) => {
          try{
               const response = await generateWorkExperience(input);
               onWorkExpGenerated(response);
          } catch (error) {
               console.error(error);
               toast.error("Ինչ-որ բան սխալ գնաց։ Խնդրում ենք նորից փորձել")
          }
     }

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Գեներացնել աշխատանքային փորձ</DialogTitle>
                         <DialogDescription>
                              Նկարագրեք այս աշխատանքային փորձը և Արհեստական Բանականությունը կգեներացնի օպտիմիզացված մուտք հատուկ Ձեզ համար
                         </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                         <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
                              <FormField
                                   control={form.control}
                                   name="description"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Նկարագրություն</FormLabel>
                                             <FormControl>
                                                  <Textarea
                                                       {...field}
                                                       placeholder={`օր․՝ "2016թ. սեպտեմբերից մինչև 2022թ. ապրիլին ես աշխատել եմ Picsart-ում որպես ծրագրավորող։ Իմ հանձնարարությունը ..."`}
                                                       autoFocus
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                                   Գեներացնել
                              </LoadingButton>
                         </form>
                    </Form>
               </DialogContent> 
          </Dialog>
     )
}