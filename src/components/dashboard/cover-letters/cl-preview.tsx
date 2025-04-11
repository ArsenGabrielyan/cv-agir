import useDimensions from "@/hooks/use-dimensions";
import { cn } from "@/lib/utils";
import { CoverLetterFormType } from "@/schemas/types"
import { useRef, useState, useEffect } from "react";
import { BodySection, HeaderSection } from "./cl-sections";

interface CoverLetterPreviewProps{
     coverLetterData: CoverLetterFormType,
     className?: string,
     contentRef?: React.Ref<HTMLDivElement>
}
export default function CoverLetterPreview({
     coverLetterData,
     className,
     contentRef
}: CoverLetterPreviewProps){
     const containerRef = useRef<HTMLDivElement>(null);
     const {width} = useDimensions(containerRef)
     const [photoSrc, setPhotoSrc] = useState(coverLetterData.profileImg instanceof File ? "" : coverLetterData.profileImg)

     useEffect(()=>{
          const objectUrl = coverLetterData.profileImg instanceof File ? URL.createObjectURL(coverLetterData.profileImg) : "";
          if(objectUrl) setPhotoSrc(objectUrl)
          if(coverLetterData.profileImg === null) setPhotoSrc("");
          return () => URL.revokeObjectURL(objectUrl);
     },[coverLetterData.profileImg])

     return (
          <div className={cn("bg-white text-black h-full w-full aspect-[210/297]",className)} ref={containerRef}>
               <div className={cn("space-y-6 p-6", !width && "invisible")} style={{zoom: (1/794) * width}} ref={contentRef} id="coverLetterPreviewContent">
                    <HeaderSection coverLetterData={coverLetterData} photoSrc={photoSrc}/>
                    <BodySection coverLetterData={coverLetterData}/>
               </div>
          </div>
     )
}