import { getCreditCardSchema } from "@/schemas";
import { CreditCardType } from "@/schemas/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useCreditCardModal from "@/hooks/use-credit-card-modal";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CreditCardInput from "@/components/form/credit-card-input";
import { useEffect, useTransition } from "react";
import LoadingButton from "@/components/buttons/loading-button";
import { addCard, editCard } from "@/actions/subscription-system/credit-card";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { getBankName } from "@/lib/helpers/credit-cards";
import { ERROR_MESSAGES } from "@/lib/constants";
import { useTranslations } from "next-intl";

export default function CreditCardModal(){
     const {update} = useSession();
     const [isPending, startTransition] = useTransition();
     const {open,setOpen,cardToEdit,index} = useCreditCardModal()
     const isEditing = cardToEdit && index!==-1;
     const validationMsg = useTranslations("validations");
     const form = useForm<CreditCardType>({
          resolver: zodResolver(getCreditCardSchema(validationMsg)),
          defaultValues: {
               cardNumber: "",
               cardName: "",
               cvv: "",
               expiryDate:  "",
               city: ""
          }
     })
     const handleSubmit = (values: CreditCardType) => {
          startTransition(()=>{
               const action = isEditing ? editCard(values,index) : addCard(values)
               action.then(data=>{
                    if(data.error){
                         toast.error(data.error)
                    }
                    if(data.success){
                         update();
                         form.reset();
                         setOpen(false);
                    }
               }).catch(()=>toast.error(ERROR_MESSAGES.unknownError))
          })
     }
     useEffect(()=>{
          if(isEditing){
               form.reset({
                    cardNumber: cardToEdit.cardNumber || "",
                    cardName: cardToEdit.cardName || "",
                    cvv: cardToEdit.cvv || "",
                    expiryDate: cardToEdit.expiryDate || "",
                    city: cardToEdit.city || "",
               })
          }
     },[cardToEdit,form,isEditing])
     const areValuesSame = (formValues: CreditCardType, originalValues: CreditCardType): boolean => (
          formValues.cardNumber === originalValues.cardNumber &&
          formValues.cardName === originalValues.cardName &&
          formValues.cvv === originalValues.cvv &&
          formValues.expiryDate === originalValues.expiryDate &&
          formValues.city === originalValues.city
     );
     const isSame = !!isEditing && !!cardToEdit && areValuesSame(form.watch(), cardToEdit);
     const currBank = getBankName(form.watch("cardNumber"));
     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>{isEditing ? "Փոխել այդ մեթոդի տվյալները" : "Ավելացնել նոր վճարման մեթոդ"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                         <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                              <FormField
                                   control={form.control}
                                   name="cardNumber"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Վարկային քարտի համար</FormLabel>
                                             <FormControl>
                                                  <CreditCardInput
                                                       {...field}
                                                       disabled={isPending}
                                                  />
                                             </FormControl>
                                             {currBank && (
                                                  <FormDescription>Բանկ՝ {currBank.title}</FormDescription>
                                             )}
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   <FormField
                                        control={form.control}
                                        name="expiryDate"
                                        render={({field})=>(
                                             <FormItem>
                                                  <FormLabel>Քարտի ժամկետ</FormLabel>
                                                  <FormControl>
                                                       <Input
                                                            {...field}
                                                            placeholder="MM/YY"
                                                            maxLength={5}
                                                            disabled={isPending}
                                                       />
                                                  </FormControl>
                                                  <FormMessage/>
                                             </FormItem>
                                        )}
                                   />
                                   <FormField
                                        control={form.control}
                                        name="cvv"
                                        render={({field})=>(
                                             <FormItem>
                                                  <FormLabel>CVV</FormLabel>
                                                  <FormControl>
                                                       <Input
                                                            {...field}
                                                            placeholder="123"
                                                            maxLength={4}
                                                            disabled={isPending}
                                                       />
                                                  </FormControl>
                                                  <FormMessage/>
                                             </FormItem>
                                        )}
                                   />
                              </div>
                              <FormField
                                   control={form.control}
                                   name="cardName"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Օգտատիրոջ անուն ազգանուն</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       placeholder="Պետրոս Պողոսյան"
                                                       disabled={isPending}
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   control={form.control}
                                   name="city"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Օգտատիրոջ հասցեն</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       placeholder="Երևան, Հայաստան"
                                                       disabled={isPending}
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <LoadingButton type="submit" className="w-full" disabled={isSame} loading={isPending}>{isEditing ? "Փոխել" : "Ավելացնել"}</LoadingButton>
                         </form>
                    </Form>
               </DialogContent>
          </Dialog>
     )
}