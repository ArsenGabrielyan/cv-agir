"use client"
import ResumePreview from "./resume-editor/resume-preview"
import { mapToResumeValues } from "@/data/helpers/other"
import { ResumeServerData } from "@/data/types"
import { formatDate } from "date-fns"
import { hy } from "date-fns/locale"
import Link from "next/link"
import QRCode from "qrcode"
import { absoluteUrl } from "@/lib/utils"
import {useState, useEffect, useTransition, useRef} from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { MoreVertical, Printer, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteResume } from "@/actions/resume/delete-resume"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import LoadingButton from "./loading-button"
import {useReactToPrint} from "react-to-print"

interface ResumeCardProps{
     data: ResumeServerData
}
export default function ResumeCard({data}: ResumeCardProps){
     const {updatedAt, createdAt, title, description, id, template} = data
     const [qrImg, setQrImg] = useState("/qr-placeholder.png");
     const wasUpdated = updatedAt!==createdAt;
     const contentRef = useRef<HTMLDivElement>(null);
     const handlePrintResume = useReactToPrint({
          contentRef,
          documentTitle: title || "Անանուն Ռեզյումե",
     })
     useEffect(()=>{
          if(id){
               const generateQR = async () => {
                    const img = await QRCode.toDataURL(absoluteUrl(`/cv/${id}`));
                    setQrImg(img)
               }
               generateQR();
          } else {
               setQrImg("/qr-placeholder.png")
          }
     },[id])
     return (
          <div className="relative group rounded-lg bg-card text-card-foreground border shadow">
               <div className="space-y-2">
                    <Link
                         href={`/editor?resumeId=${id}`}
                         className="relative inline-block w-full"
                    >
                         <ResumePreview
                              resumeData={mapToResumeValues(data)}
                              template={template}
                              qrImg={qrImg}
                              contentRef={contentRef}
                              className="shadow-sm group-hover:shadow-lg transition-shadow"
                              isEditing={true}
                         />
                         <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                    </Link>
                    <div className="p-4 space-y-1 text-center">
                         <p className="line-clamp-1 font-semibold">{title || "Անանուն Ռեզյումե"}</p>
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
               <MoreMenu resumeId={id} onPrintClick={handlePrintResume}/>
          </div>
     )
}

interface MoreMenuProps{
     resumeId: string;
     onPrintClick: () => void,
}
function MoreMenu({resumeId,onPrintClick}: MoreMenuProps){
     const [showDelConfirmation, setShowDelConfirmation] = useState(false);
     return (
          <>
          <DropdownMenu modal={false}>
               <DropdownMenuTrigger asChild>
                    <Button
                         variant="ghost"
                         size="icon"
                         className="absolute right-0.5 bottom-0.5 opacity-0 transition-opacity group-hover:opacity-100 z-10"
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
          <DeleteConfirmationDialog
               resumeId={resumeId}
               open={showDelConfirmation}
               onOpenChange={setShowDelConfirmation}
          />
          </>
     )
}

interface DeleteConfirmationDialogProps{
     resumeId: string,
     open: boolean,
     onOpenChange: (open: boolean) => void
}
function DeleteConfirmationDialog({resumeId,open,onOpenChange}: DeleteConfirmationDialogProps){
     const [isPending, startTransition] = useTransition();

     const handleDelete = async() => {
          startTransition(async()=>{
               try{
                    await deleteResume(resumeId);
                    onOpenChange(false);
               } catch (error) {
                    console.log(error);
                    toast.error("Վայ, ինչ-որ բան սխալ գնաց։ Խնդրում ենք նորից փորձել")
               }
          })
     }

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Ջնջե՞լ ռեզյումեն</DialogTitle>
                         <DialogDescription>Այս գործողությունը հնարավոր չէ հետարկել:</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                         <LoadingButton
                              variant="destructive"
                              onClick={handleDelete}
                              loading={isPending}
                         >
                              Ջնջել
                         </LoadingButton>
                         <Button variant="secondary" onClick={()=>onOpenChange(false)}>
                              Փակել
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
}