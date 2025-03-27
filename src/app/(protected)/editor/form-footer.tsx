import { Button } from "@/components/ui/button"
import { FileUser, PenLineIcon, XSquare } from "lucide-react"
import Link from "next/link"
import { steps } from "./steps"

interface FormFooterProps{
     currStep: string,
     setCurrStep: (step: string) => void
     showSmResumePreview: boolean,
     setShowSmResumePreview: (show: boolean) => void
}
export default function FormFooter({
     currStep,
     setCurrStep,
     showSmResumePreview,
     setShowSmResumePreview
}: FormFooterProps){
     const prevStep = steps.find(
          (_,i)=> steps[i+1]?.key===currStep
     )?.key
     const nextStep = steps.find(
          (_,i)=>steps[i-1]?.key===currStep
     )?.key
     return (
          <footer className="w-full border-t px-3 py-5">
               <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3 items-center">
                    <div className="flex items-center gap-4">
                         <Button
                              variant="secondary"
                              onClick={prevStep ? () => setCurrStep(prevStep) : undefined}
                              disabled={!prevStep}
                         >Նախորդ էջ</Button>
                         <Button
                              onClick={nextStep ? () => setCurrStep(nextStep) : undefined}
                              disabled={!nextStep}
                         >Հաջորդ էջ</Button>
                    </div>
                    <Button
                         variant="outline"
                         size="icon"
                         onClick={()=>setShowSmResumePreview(!showSmResumePreview)}
                         className="md:hidden"
                         title={showSmResumePreview ? "Խմբագրել ռեզյումեն" : "Ցույց տալ նախադիտումը"}
                    >
                         {showSmResumePreview ? <PenLineIcon/> : <FileUser/>}
                    </Button>
                    <Button asChild variant="secondary">
                         <Link href="/dashboard"><XSquare/> Փակել</Link>
                    </Button>
               </div>
          </footer>
     )
}