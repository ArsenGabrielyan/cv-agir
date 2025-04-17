import { useReactToPrint, UseReactToPrintOptions} from "react-to-print";
import { useIsMobile } from "./use-mobile";

export default function usePrint({contentRef,documentTitle,...options}: UseReactToPrintOptions) {
     const printDesktop = useReactToPrint({
          contentRef,
          documentTitle,
          ...options
     })
     const isMobile = useIsMobile();
     const handlePrint = () => {
          if (!contentRef?.current) return;
          if(isMobile){
               const element = contentRef.current;
               if (!element) {
                    console.error("Print reference is null");
                    return;
               }
               const styleTags = Array.from(document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>('link[rel="stylesheet"], style'))
               .map((node) => node.outerHTML)
               .join("\n");

               const clone = element.cloneNode(true) as HTMLElement;
               const html = `
               <!DOCTYPE html>
               <html lang="en">
                    <head>
                         <meta charset="utf-8" />
                         <title>${documentTitle || "Print"}</title>
                         ${styleTags}
                         <style>
                              /* Reset margins & ensure color printing */
                              html, body { margin: 0; padding: 0; }
                              @media print { body { -webkit-print-color-adjust: exact; } }
                         </style>
                    </head>
                    <body>
                         <div id="print-root"></div>
                    </body>
               </html>
               `;
               const blob = new Blob([html], { type: "text/html" });
               const url = URL.createObjectURL(blob);
               const printWindow = window.open(url, "_blank");

               if (!printWindow) {
                    console.error("Could not open print window");
                    URL.revokeObjectURL(url);
                    return;
               }
               printWindow.addEventListener("load", () => {
                    const root = printWindow.document.getElementById("print-root");
                    if (root) root.appendChild(clone);
                    printWindow.focus();
                    printWindow.print();
                    setTimeout(() => {
                         printWindow.close();
                         URL.revokeObjectURL(url);
                    }, 300);
               });
          } else {
               printDesktop()
          }
     }
     return handlePrint
}