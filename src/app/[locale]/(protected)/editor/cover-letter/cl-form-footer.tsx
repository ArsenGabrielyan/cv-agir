import { PenLineIcon, FileText, XSquare } from "lucide-react";
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button";
import { CoverLetterFormProps, EditorFormFooterProps } from "@/lib/types";
import useEditorSteps from "@/hooks/use-editor-steps";
import { steps } from "./steps";

export default function CoverLetterFormFooter({
     currStep,
     setCurrStep,
     showSmPreview,
     setShowSmPreview,
     onPrint
}: EditorFormFooterProps){
     const {prevStep, nextStep, lastStep} = useEditorSteps<CoverLetterFormProps>(steps,currStep);
     return (
          <footer className="w-full border-t px-3 py-5">
               <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3 items-center">
                    <div className="flex items-center gap-4">
                         <Button
                              variant="secondary"
                              onClick={prevStep ? () => setCurrStep(prevStep) : undefined}
                              disabled={!prevStep}
                         >Նախորդ էջ</Button>
                         {!lastStep ? (
                              <Button
                                   onClick={nextStep ? () => setCurrStep(nextStep) : undefined}
                                   disabled={!nextStep}
                              >Հաջորդ էջ</Button>
                         ) : (
                              <Button
                                   onClick={onPrint}
                              >
                                   Տպել նամակը
                              </Button>
                         )}
                    </div>
                    <Button
                         variant="outline"
                         size="icon"
                         onClick={()=>setShowSmPreview(!showSmPreview)}
                         className="md:hidden"
                         title={showSmPreview ? "Խմբագրել նամակը" : "Ցույց տալ նախադիտումը"}
                    >
                         {showSmPreview ? <PenLineIcon/> : <FileText/>}
                    </Button>
                    <Button asChild variant="secondary">
                         <Link href="/dashboard"><XSquare/> Փակել</Link>
                    </Button>
               </div>
          </footer>
     )
}