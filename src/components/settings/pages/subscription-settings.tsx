import SettingsCard from "../settings-card";
import { useCurrentSubscriptionLevel, useCurrentUser } from "@/hooks/use-current-user";
import { SettingsContentProps } from "../settings-tabs";
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { formatDate } from "date-fns";
import { hy } from "date-fns/locale"
import { cn } from "@/lib/utils";
import { Subscription } from "@db";
import PremiumButton from "@/components/buttons/premium-button";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import LoadingButton from "@/components/buttons/loading-button";
import { cancelSubscription, renewSubscription } from "@/actions/subscription-system";
import { toast } from "sonner";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import CreditCardItem from "../premium/cc-components/credit-card-item";
import CreditCardModal from "@/components/settings/premium/cc-components/credit-card-modal";
import { UpdateSession, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function SubscriptionSettings({subscriptions, isExpired}: SettingsContentProps){
     const {update} = useSession()
     const user = useCurrentUser();
     const subscriptionLevel = useCurrentSubscriptionLevel(isExpired as boolean);
     const currentSubsciption = subscriptions?.find(val=>val.id===user?.subscriptionId);
     const isNotEmpty = subscriptions && subscriptions.length!==0;
     const [isPending, startTransition] = useTransition();
     const [showCancelDialog, setShowCancelDialog] = useState(false);
     const isMobile = useIsMobile();
     const isCurrent = (subscription: Subscription) => !!currentSubsciption && JSON.stringify(currentSubsciption)===JSON.stringify(subscription);
     const errMsg = useTranslations("error-messages")
     const handleRenewSub = () => {
          startTransition(()=>{
               if(!user || !user.id) return;
               renewSubscription(user.id)
               .then(data=>{
                    if(data.error){
                         toast.error(data.error)
                    }
                    if(data.success){
                         update();
                    }
               })
               .catch(()=>toast.error(errMsg("unknownError")))
          })
     }
     return (user && user.id) ? (
          <div className="space-y-4">
               <SettingsCard title="Բաժանորդագրություն">
                    <p>Ընթացիկ տարբերակ՝ <span className="font-semibold">{subscriptionLevel==="premium" ? "Պրեմիում" : "Անվճար"}</span></p>
                    {currentSubsciption && subscriptionLevel==="premium" ? (
                         <>
                              <p className="text-2xl md:text-3xl lg:text-4xl font-semibold">${currentSubsciption.price} / {currentSubsciption.period==="monthly" ? "ամիս" : "տարի"}</p>
                              <p className="text-muted-foreground text-sm">Ձեր բաժանորդագրությունը կթարմացվի {formatDate(currentSubsciption.endDate,"MMM d, yyyy, HH:mm",{locale: hy})}</p>
                              <div className="flex items-center flex-wrap gap-2">
                                   <Button size={isMobile ? "sm" : "default"} variant="outline" onClick={()=>setShowCancelDialog(true)}>Չեղարկել բաժանորդագրությունը</Button>
                              </div>
                         </>
                    ) : (
                         isExpired ? (
                              <LoadingButton size={isMobile ? "sm" : "default"} loading={isPending} onClick={handleRenewSub}>Թարմացնել բաժանորդագրությունը</LoadingButton>
                         ) : (
                              <PremiumButton className="w-fit"/>
                         )
                    )}
               </SettingsCard>
               {(isNotEmpty && currentSubsciption) && (
                    <>
                         {(user.creditCards && user.creditCards.length!==0) && (
                              <SettingsCard title="Վճարման մեթոդ" className={cn(isMobile && "space-y-8")}>
                                   {user.creditCards.map((card,i)=>(
                                        <CreditCardItem key={i} card={card} index={i} deleteDisabled={user.creditCards.length===1}/>
                                   ))}
                              </SettingsCard>
                         )}
                         <SettingsCard title="Հաշիվներ">
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead>Ամսաթիվ</TableHead>
                                             <TableHead>Գին</TableHead>
                                             <TableHead>Տարբերակ</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {subscriptions.map(subscription=>(
                                             <TableRow key={subscription.id} className={cn(isCurrent(subscription) && "font-semibold")}>
                                                  <TableCell>{formatDate(subscription.startDate,"dd-MM-yyyy")}</TableCell>
                                                  <TableCell className="flex items-center gap-4">
                                                       ${subscription.price}
                                                       {!isExpired && subscription.plan===subscriptionLevel && (
                                                            <Badge variant="success">Վճարված է</Badge>
                                                       )}
                                                  </TableCell>
                                                  <TableCell>{subscription.plan==="premium" ? "Պրեմիում" : "Անվճար"}</TableCell>
                                             </TableRow>
                                        ))}
                                   </TableBody>
                              </Table>
                         </SettingsCard>
                    </>
               )}
               <CancelSubDialog userId={user.id} open={showCancelDialog} onOpenChange={setShowCancelDialog} updateSession={update}/>
               <CreditCardModal />
          </div>
     ) : null
}

interface CancelSubDialogProps{
     userId: string,
     open: boolean,
     onOpenChange: (open: boolean) => void,
     updateSession: UpdateSession
}
function CancelSubDialog({userId,open,onOpenChange,updateSession}: CancelSubDialogProps){
     const [isPending, startTransition] = useTransition();
     const errMsg = useTranslations("error-messages")
     const handleCancel = () => {
          startTransition(()=>{
               cancelSubscription(userId)
               .then(data=>{
                    if(data.error){
                         toast.error(data.error)
                    }
                    if(data.success){
                         updateSession();
                         onOpenChange(false);
                    }
               })
               .catch(()=>toast.error(errMsg("unknownError")))
          })
     }
     return (
          <DeleteConfirmationDialog
               open={open}
               onOpenChange={onOpenChange}
               loading={isPending}
               onAccept={handleCancel}
               acceptButtonText="Չեղարկել այն"
               dialogTitle="Համոզվա՞ծ եք, որ ուզում եք չեղարկել բաժանորդագրությունը:"
          />
     )
}