import { CoverLetterFormType } from "@/schemas/types"
import Image from "next/image"
import { getBorderRadius } from "@/data/helpers"
import PreviewSectionWrapper from "../wrappers/section-wrapper"
import { formatDate } from "date-fns"
import Markdown from "markdown-to-jsx"

interface CoverLetterSectionProps{
     photoSrc?: string | null,
     coverLetterData: CoverLetterFormType
}
export function HeaderSection({photoSrc, coverLetterData}: CoverLetterSectionProps){
     const {fname, lname, jobTitle, address, phone, email, letterDate, colorHex, borderStyle} = coverLetterData;
     const otherInfo = letterDate ? [phone,email,formatDate(letterDate || "","dd-MM-yyyy")] : [phone,email]
     return (
          <div className="flex justify-between items-center gap-4">
               <div className="flex items-center gap-6">
                    {photoSrc && (
                         <Image
                              src={photoSrc}
                              alt="Աշխատողի նկար"
                              width={100}
                              height={100}
                              className="aspect-square object-cover"
                              style={{borderRadius: getBorderRadius(borderStyle || "square")}}
                         />
                    )}
                    <div className="space-y-2.5">
                         <div className="space-y-1">
                              <p className="text-3xl font-bold" style={{color: colorHex}}>{fname} {lname}</p>
                              <p className="font-medium" style={{color: colorHex}}>{jobTitle}</p>
                         </div>
                         <p className="text-xs text-muted-foreground">
                              {address}
                              {address && (phone || email) ? " • " : ""}
                              {otherInfo.filter(Boolean).join(" • ")}
                         </p>
                    </div>
               </div>
          </div>
     )
}
export function BodySection({coverLetterData}: CoverLetterSectionProps){
     const {recipientName, recipientTitle, companyAddress, companyName, letterContent, colorHex} = coverLetterData;
     return (
          <PreviewSectionWrapper style={{colorHex}}>
               <div className="text-sm space-y-4">
                    <div className="space-y-1.5">
                         <p className="font-semibold">{recipientName}</p>
                         <p>{recipientTitle}</p>
                    </div>
                    <div className="space-y-1.5">
                         <p className="text-muted-foreground">{companyName}</p>
                         <p className="text-muted-foreground">{companyAddress}</p>
                    </div>
               </div>
               {letterContent && (
                    <div className="prose text-sm">
                         <Markdown>{letterContent}</Markdown>
                    </div>
               )}
          </PreviewSectionWrapper>
     )
}