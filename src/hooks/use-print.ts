import { useReactToPrint, UseReactToPrintOptions} from "react-to-print";
import { useIsMobile } from "./use-mobile";
import printJS from "print-js";
import { absoluteUrl } from "@/lib/utils";

export default function usePrint({contentRef,documentTitle,...options}: Omit<UseReactToPrintOptions,"contentRef"> & {
     contentRef?: React.RefObject<HTMLDivElement | null>
}) {
     const printDesktop = useReactToPrint({
          contentRef,
          documentTitle,
          ...options
     })
     const isMobile = useIsMobile();
     const handlePrint = () => {
          if (!contentRef?.current) return;
          if(isMobile){
               printJS({
                    printable: contentRef.current,
                    type: "html",
                    scanStyles: false,
                    css: [
                         absoluteUrl("/print.css")
                    ],
                    style: `
                    #resumePreviewContent,
                    #coverLetterPreviewContent {
                         zoom: 1 !important;
                         -webkit-print-color-adjust: exact;
                         print-color-adjust: exact;
                    }
                    @page {
                         size: a4 portrait;
                         margin: 0;
                    }
                    `
               })
          } else {
               printDesktop()
          }
     }
     return handlePrint
}