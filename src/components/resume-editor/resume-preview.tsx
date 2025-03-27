"use client"
import { compileHTML } from "@/data/helpers/other";
import useDimensions from "@/hooks/use-dimensions";
import { cn } from "@/lib/utils";
import { ResumeFormType } from "@/schemas/types";
import { ResumeTemplate } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import DOMPurify from "isomorphic-dompurify"
import {CoursesSection, EducationSection, HeaderSection, HobbiesSection, LanguagesSection, LinksSection, ReferencesSection, SkillsSection, SummarySection, WorkExperienceSection} from "./resume-sections";
import { format } from "date-fns";

interface ResumePreviewProps{
     template: ResumeTemplate | null
     resumeData: ResumeFormType,
     className?: string,
     qrImg?: string
}
export default function ResumePreview({template,resumeData,className,qrImg}: ResumePreviewProps){
     const containerRef = useRef<HTMLDivElement>(null);
     const {width} = useDimensions(containerRef)
     const [photoSrc, setPhotoSrc] = useState(resumeData.profileImg instanceof File ? "" : resumeData.profileImg)
     const [compiledHTML, setCompiledHTML] = useState<string>("");

     useEffect(()=>{
          const objectUrl = resumeData.profileImg instanceof File ? URL.createObjectURL(resumeData.profileImg) : "";
          if(objectUrl) setPhotoSrc(objectUrl)
          if(resumeData.profileImg === null) setPhotoSrc("");
          return () => URL.revokeObjectURL(objectUrl);
     },[resumeData.profileImg])

     useEffect(()=>{
          if(template && template.htmlTemplate){
               const context: ResumeFormType = {
                    ...resumeData,
                    qrImg,
                    profileImg: photoSrc,
                    experience: resumeData.experience?.map(val => ({
                         ...val,
                         startDate: !val.startDate ? "" : format(val.startDate,"MM/yyyy"),
                         endDate: !val.endDate ? "Այսօր" : format(val.endDate,"MM/yyyy")
                    })),
                    education: resumeData.education?.map(val=>({
                         ...val,
                         startDate: !val.startDate ? "" : format(val.startDate,"MM/yyyy"),
                         endDate: !val.endDate ? "Այսօր" : format(val.endDate,"MM/yyyy")
                    })),
                    courses: resumeData.courses?.map(val=>({
                         ...val,
                         startDate: !val.startDate ? "" : format(val.startDate,"MM/yyyy"),
                         endDate: !val.endDate ? "Այսօր" : format(val.endDate,"MM/yyyy")
                    }))
               };
               setCompiledHTML(compileHTML(template.htmlTemplate,context))
          }
     },[template, qrImg, resumeData, photoSrc])
     return (
          <div className={cn("bg-white text-black h-full w-full aspect-[210/297]",className)} ref={containerRef}>
               <div className={!template ? cn("space-y-6 p-6", !width && "invisible") : cn("h-full", !width && "invisible")} style={{zoom: (1/794) * width}}>
                    {!template ? (
                         <>
                              <HeaderSection resumeData={resumeData} photoSrc={photoSrc} qrImg={qrImg}/>
                              <div className="grid gap-5" style={{gridTemplateColumns: "2fr 1fr"}}>
                                   <div className="space-y-4">
                                        <SummarySection resumeData={resumeData}/>
                                        <WorkExperienceSection resumeData={resumeData}/>
                                        <EducationSection resumeData={resumeData}/>
                                        <CoursesSection resumeData={resumeData}/>
                                        <ReferencesSection resumeData={resumeData}/>
                                   </div>
                                   <div className="space-y-4">
                                        <SkillsSection resumeData={resumeData}/>
                                        <LanguagesSection resumeData={resumeData}/>
                                        <LinksSection resumeData={resumeData}/>
                                        <HobbiesSection resumeData={resumeData}/>
                                   </div>
                              </div>
                         </>
                    ) : (
                         <>
                              <style>{template.cssStyle}</style>
                              <div className="h-full break-inside-avoid" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(compiledHTML,{
                                   ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|blob):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
                              })}}/>
                         </>
                    )}
               </div>
          </div>
     )
}