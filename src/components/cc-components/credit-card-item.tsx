import { decryptData } from "@/actions/encryption";
import { getCreditCardBrandName, mapToCreditCardValues } from "@/data/helpers/other";
import { CreditCard } from "@prisma/client";
import { formatDate } from "date-fns";
import CreditCardIcon from "@/components/cc-components/credit-card-icon";
import { useEffect, useState, useTransition } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash, Plus } from "lucide-react";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import { toast } from "sonner";
import { deleteCard } from "@/actions/subscription-system/credit-card";
import useCreditCardModal from "@/hooks/use-credit-card-modal";
import { useSession } from "next-auth/react";

interface CreditCardItemProps{
     card: CreditCard,
     index: number,
     deleteDisabled: boolean
}

export default function CreditCardItem({card, index, deleteDisabled}: CreditCardItemProps){
     const [safeCardInfo, setSafeCardInfo] = useState({
          cardNumber: "",
          brand: ""
     })
     const [showDeleteDialog, setShowDeleteDialog] = useState(false);
     const creditCardModal = useCreditCardModal();
     useEffect(()=>{
          const getCardNumber = async()=>{
               const cardNum = await decryptData(card.cardNumber);
               const brand = getCreditCardBrandName(cardNum)
               setSafeCardInfo(prev=>({
                    ...prev,
                    cardNumber: cardNum.slice(-4),
                    brand
               }))
          }
          getCardNumber();
     },[card.cardNumber]);
     const handleEditCard = async () => {
          creditCardModal.setCreditCard({
               ...mapToCreditCardValues(card),
               cardNumber: await decryptData(card.cardNumber),
               cvv: await decryptData(card.cvv)
          });
          creditCardModal.setIndex(index);
          creditCardModal.setOpen(true);
     }
     const handleAddCard = () => {
          creditCardModal.setCreditCard(null);
          creditCardModal.setIndex(-1);
          creditCardModal.setOpen(true);
     }
     return (safeCardInfo.cardNumber && safeCardInfo.brand) ? (
          <>
               <div className="flex justify-between items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-4">
                         <CreditCardIcon brand={safeCardInfo.brand}/>
                         <p className="text-xl font-semibold">{safeCardInfo.brand}</p>
                         <p className="text-muted-foreground">•••• {safeCardInfo.cardNumber}</p>
                    </div>
                    <div className="flex items-center gap-4">
                         <p>Վավեր է մինչև {formatDate(card.expiryDate,"MM/yyyy")}</p>
                         <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                   <Button variant="outline" size="icon" title="Մենյու">
                                        <MoreVertical/>
                                   </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                   <DropdownMenuItem
                                        className="flex items-center gap-2"
                                        onClick={handleEditCard}
                                   >
                                        <Edit/> Փոխել
                                   </DropdownMenuItem>
                                   <DropdownMenuItem
                                        className="flex items-center gap-2"
                                        disabled={deleteDisabled}
                                        onClick={()=>{
                                             if(deleteDisabled) return;
                                             setShowDeleteDialog(true)
                                        }}
                                   >
                                        <Trash/> Ջնջել
                                   </DropdownMenuItem>
                              </DropdownMenuContent>
                         </DropdownMenu>
                    </div>
               </div>
               <Button variant="ghost" className="hidden last:inline-flex" onClick={handleAddCard}>
                    <Plus/> Ավելացնել նոր վճարման մեթոդ
               </Button>
               <DeleteCardDialog index={index} open={showDeleteDialog} onOpenChange={setShowDeleteDialog}/>
          </>
     ) : null
}

interface DeleteCardDialogProps{
     index: number
     open: boolean,
     onOpenChange: (open: boolean) => void
}
function DeleteCardDialog({index,open,onOpenChange}: DeleteCardDialogProps){
     const {update} = useSession();
     const [isPending, startTransition] = useTransition();

     const handleDelete = () => {
          startTransition(()=>{
               deleteCard(index)
               .then((data)=>{
                    if(data.error){
                         toast.error(data.error)
                    }
                    if(data.success){
                         update();
                         onOpenChange(false);
                    }
               }).catch(()=>toast.error("Վայ, մի բան սխալ տեղի ունեցավ"))
          })
     }

     return (
          <DeleteConfirmationDialog
               open={open}
               onOpenChange={onOpenChange}
               loading={isPending}
               onAccept={handleDelete}
               dialogTitle="Համոզվա՞ծ եք, որ ուզում եք ջնջել այս վճարման մեթոդը:"
          />
     )
}