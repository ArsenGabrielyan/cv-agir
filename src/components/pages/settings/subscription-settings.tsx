import SettingsCard from "../../settings/settings-card";
import { useCurrentSubscriptionLevel, useCurrentUser } from "@/hooks/use-current-user";
import { SettingsContentProps } from "@/components/pages/settings";
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { formatDate } from "date-fns";
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
import CreditCardItem from "../../settings/premium/cc-components/credit-card-item";
import CreditCardModal from "@/components/settings/premium/cc-components/credit-card-modal";
import { UpdateSession, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { dateFNSLocales } from "@/i18n/config";

export default function SubscriptionSettings({subscriptions, isExpired}: SettingsContentProps){
     const {update} = useSession()
     const user = useCurrentUser();
     const subscriptionLevel = useCurrentSubscriptionLevel(isExpired as boolean);
     const currentSubsciption = subscriptions?.find(val=>val.id===user?.subscriptionId);
     const isNotEmpty = subscriptions && subscriptions.length!==0;
     const [isPending, startTransition] = useTransition();
     const locale = useLocale()
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
     const t = useTranslations("settings.sections.subscription");
     const prefix = useTranslations("checkout-subscription.prefix")
     return (user && user.id) ? (
          <div className="space-y-4">
               <SettingsCard title={t("title")}>
                    <p>{t.rich("currentPlan.text",{
                         bold: chunks => <span className="font-semibold">{chunks}</span>,
                         subscriptionLevel: subscriptionLevel==="premium" ? t("currentPlan.premium") : t("currentPlan.free")
                    })}</p>
                    {currentSubsciption && subscriptionLevel==="premium" ? (
                         <>
                              <p className="text-2xl md:text-3xl lg:text-4xl font-semibold">${currentSubsciption.price} / {currentSubsciption.period==="monthly" ? prefix("monthly") : prefix("annual")}</p>
                              <p className="text-muted-foreground text-sm">{t("renew-txt")} {formatDate(currentSubsciption.endDate,"MMM d, yyyy, HH:mm",{locale: dateFNSLocales[locale]})}</p>
                              <div className="flex items-center flex-wrap gap-2">
                                   <Button size={isMobile ? "sm" : "default"} variant="outline" onClick={()=>setShowCancelDialog(true)}>{t("cancel-sub")}</Button>
                              </div>
                         </>
                    ) : (
                         isExpired ? (
                              <LoadingButton size={isMobile ? "sm" : "default"} loading={isPending} onClick={handleRenewSub}>{t("renew-sub")}</LoadingButton>
                         ) : (
                              <PremiumButton className="w-fit"/>
                         )
                    )}
               </SettingsCard>
               {(isNotEmpty && currentSubsciption) && (
                    <>
                         {(user.creditCards && user.creditCards.length!==0) && (
                              <SettingsCard title={t("payment-method.title")} className={cn(isMobile && "space-y-8")}>
                                   {user.creditCards.map((card,i)=>(
                                        <CreditCardItem key={i} card={card} index={i} deleteDisabled={user.creditCards.length===1}/>
                                   ))}
                              </SettingsCard>
                         )}
                         <SettingsCard title={t("accounts.title")}>
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead>{t("accounts.cols.date")}</TableHead>
                                             <TableHead>{t("accounts.cols.price")}</TableHead>
                                             <TableHead>{t("accounts.cols.plan")}</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {subscriptions.map(subscription=>(
                                             <TableRow key={subscription.id} className={cn(isCurrent(subscription) && "font-semibold")}>
                                                  <TableCell>{formatDate(subscription.startDate,"dd-MM-yyyy")}</TableCell>
                                                  <TableCell className="flex items-center gap-4">
                                                       ${subscription.price}
                                                       {!isExpired && subscription.plan===subscriptionLevel && (
                                                            <Badge variant="success">{t("accounts.paid")}</Badge>
                                                       )}
                                                  </TableCell>
                                                  <TableCell>{subscription.plan==="premium" ? t("currentPlan.premium") : t("currentPlan.free")}</TableCell>
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
     const errMsg = useTranslations("error-messages");
     const t = useTranslations("deletion-confirmation")
     const buttonTxt = useTranslations("buttons")

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
               acceptButtonText={buttonTxt("cancel")}
               dialogTitle={t("titles.cancel-sub")}
               t={t}
          />
     )
}