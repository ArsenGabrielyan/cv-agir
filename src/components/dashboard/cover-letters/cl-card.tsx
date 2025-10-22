"use client"
import { deleteCoverLetter } from "@/actions/cover-letter/delete-letter";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { CoverLetter } from "@db"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Printer } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { mapToLetterValues } from "@/lib/helpers/maps";
import { formatDate } from "date-fns";
import { hy } from "date-fns/locale";
import DocPreviewLoader from "@/components/loaders/doc-preview";
import usePrint from "@/hooks/use-print";
import { ERROR_MESSAGES } from "@/lib/constants";

interface CoverLetterCardProps{
     data: CoverLetter
}
const CoverLetterPreview = dynamic(()=>import("@/components/dashboard/cover-letters/cl-preview"),{
     loading: () => <DocPreviewLoader/>
})
export default function CoverLetterCard({data}: CoverLetterCardProps){
     const {updatedAt, createdAt, title, description, id} = data;
     const wasUpdated = updatedAt!==createdAt;
     const contentRef = useRef<HTMLDivElement>(null);
     const handlePrintCoverLetter = usePrint({
          contentRef,
          documentTitle: title || "Անանուն Ուղեկցող Նամակ",
     })
     return (
          <div className="relative group rounded-lg bg-card text-card-foreground border shadow">
               <div className="space-y-2">
                    <Link
                         href={`/editor/cover-letter?coverLetterId=${id}`}
                         className="relative inline-block w-full"
                    >
                         <CoverLetterPreview
                              coverLetterData={mapToLetterValues(data)}
                              contentRef={contentRef}
                              className="shadow-sm group-hover:shadow-lg transition-shadow"
                         />
                         <span className="inline-block absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent" />
                    </Link>
                    <div className="p-4 space-y-1 text-center">
                         <p className="line-clamp-1 font-semibold">{title || "Անանուն Ուղեկցող նամակ"}</p>
                         {description && (
                              <p className="line-clamp-2 text-sm">{description}</p>
                         )}
                         <p className="text-xs text-muted-foreground">
                              {wasUpdated ? "Թարմացվել է": 'Ստեղծվել է'}{" "}
                              {formatDate(updatedAt,"MMM d, yyyy, HH:mm",{
                                   locale: hy
                              })}
                         </p>
                    </div>
               </div>
               <MoreMenu coverLetterId={id} onPrintClick={handlePrintCoverLetter}/>
          </div>
     )
}

interface MoreMenuProps{
     coverLetterId: string;
     onPrintClick: () => void,
}
function MoreMenu({coverLetterId,onPrintClick}: MoreMenuProps){
     const [showDelConfirmation, setShowDelConfirmation] = useState(false);
     return (
          <>
          <DropdownMenu modal={false}>
               <DropdownMenuTrigger asChild>
                    <Button
                         variant="ghost"
                         size="icon"
                         className="absolute right-0.5 bottom-0.5 opacity-0 transition-opacity group-hover:opacity-100 z-10"
                         title="Այլ գործողություններ"
                    >
                         <MoreVertical className="size-4"/>
                    </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                    <DropdownMenuItem
                         className="flex items-center gap-2"
                         onClick={()=> setShowDelConfirmation(true)}
                    >
                         <Trash2 className="size-4"/>
                         Ջնջել
                    </DropdownMenuItem>
                    <DropdownMenuItem
                         className="flex items-center gap-2"
                         onClick={onPrintClick}
                    >
                         <Printer className="size-4"/>
                         Տպել
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu>
          <DeleteCoverLetterDialog
               coverLetterId={coverLetterId}
               open={showDelConfirmation}
               onOpenChange={setShowDelConfirmation}
               
          />
          </>
     )
}

interface DeleteCoverLetterDialogProps{
     coverLetterId: string,
     open: boolean,
     onOpenChange: (open: boolean) => void
}
function DeleteCoverLetterDialog({coverLetterId,open,onOpenChange}: DeleteCoverLetterDialogProps){
     const [isPending, startTransition] = useTransition();

     const handleDelete = async() => {
          startTransition(async()=>{
               try{
                    await deleteCoverLetter(coverLetterId)
                    onOpenChange(false);
               } catch (error) {
                    console.error(error);
                    toast.error(ERROR_MESSAGES.unknownError)
               }
          })
     }

     return (
          <DeleteConfirmationDialog
               open={open}
               onOpenChange={onOpenChange}
               loading={isPending}
               onAccept={handleDelete}
               dialogTitle="Համոզվա՞ծ եք, որ ուզում եք ջնջել ուղեկցող նամակը։"
          />
     )
}