import { ResumeStyleType } from "@/schemas/types"

interface ResumeSectionWrapperProps{
     title: string,
     children?: React.ReactNode,
     style?: ResumeStyleType
}
export default function ResumeSectionWrapper({title,children,style}: ResumeSectionWrapperProps){
     return (
          <>
               <hr className="border-2" style={{borderColor: style?.colorHex}}/>
               <div className="space-y-3 break-inside-avoid">
                    <p className="text-lg font-semibold" style={{color: style?.colorHex}}>{title}</p>
                    {children}
               </div>
          </>
     )
}