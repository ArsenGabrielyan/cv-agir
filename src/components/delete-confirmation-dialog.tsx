import { Button } from "@/components/ui/button";
import LoadingButton from "./buttons/loading-button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps{
     open: boolean,
     onOpenChange: (open: boolean) => void
     loading: boolean,
     onAccept: () => void,
     acceptButtonText?: string,
     dialogTitle?: string
}
export default function DeleteConfirmationDialog({
     open,
     onOpenChange,
     loading,
     onAccept,
     acceptButtonText="Ջնջել",
     dialogTitle="Համոզվա՞ծ եք, որ ուզում եք ջնջել ռեզյումեն։"
}: DeleteConfirmationDialogProps){
     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle className="leading-6">{dialogTitle}</DialogTitle>
                         <DialogDescription>Այս գործողությունը հնարավոր չէ հետարկել:</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                         <LoadingButton
                              variant="destructive"
                              onClick={onAccept}
                              loading={loading}
                         >
                              {acceptButtonText}
                         </LoadingButton>
                         <Button variant="secondary" onClick={()=>onOpenChange(false)}>
                              Փակել
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
}