import { ResumeFormType } from "@/schemas/types"
import Image from "next/image"
import {format} from "date-fns"
import Markdown from "markdown-to-jsx"
import { Badge } from "../ui/badge"
import { getBorderRadius, getLanguageLevel } from "@/data/helpers/other"
import { Button } from "../ui/button"
import Link from "next/link"
import ResumeSectionWrapper from "./wrappers/resume-section-wrapper"
import { BorderStyles } from "@/app/(protected)/editor/style-buttons/border-style-button"

interface ResumeSectionProps{
     photoSrc?: string | null,
     qrImg?: string,
     resumeData: ResumeFormType
}
export function HeaderSection({photoSrc, resumeData, qrImg}: ResumeSectionProps){
     const {fname, lname, jobTitle, address, phone, email, colorHex, borderStyle} = resumeData;
     return (
          <div className="flex justify-between items-center gap-4">
               <div className="flex items-center gap-6">
                    {photoSrc && (
                         <Image
                              src={photoSrc}
                              alt="Ռեզյումեի նկար"
                              width={100}
                              height={100}
                              className="aspect-square object-cover"
                              style={{borderRadius: getBorderRadius(borderStyle as BorderStyles)}}
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
                              {[phone,email].filter(Boolean).join(" • ")}
                         </p>
                    </div>
               </div>
               {qrImg && (
                    <Image
                         src={qrImg}
                         alt="Ռեզյումեի նկար"
                         width={100}
                         height={100}
                         className="aspect-square object-cover"
                    />
               )}
          </div>
     )
}

export function SummarySection({resumeData}: ResumeSectionProps){
     const {summary, colorHex} = resumeData
     return !summary ? null : (
          <ResumeSectionWrapper title="Իմ մասին" style={{colorHex}}>
               <p className="whitespace-pre-line text-sm">{summary}</p>
          </ResumeSectionWrapper>
     )
}

export function HobbiesSection({resumeData}: ResumeSectionProps){
     const {hobbies, colorHex} = resumeData
     return !hobbies ? null : (
          <ResumeSectionWrapper title="Հոբբիներ" style={{colorHex}}>
               <p className="whitespace-pre-line text-sm">{hobbies}</p>
          </ResumeSectionWrapper>
     )
}

export function WorkExperienceSection({resumeData}: ResumeSectionProps){
     const {experience, colorHex} = resumeData
     const expNotEmpty = experience?.filter(exp=>Object.values(exp).filter(Boolean).length > 0)
     return !expNotEmpty?.length ? null : (
          <ResumeSectionWrapper title="Աշխատանքային փորձ" style={{colorHex}}>
               {expNotEmpty.map((exp,i)=>(
                    <div key={i} className="break-inside-avoid space-y-1">
                         <div className="flex items-center justify-between text-sm font-semibold">
                              <span>{exp.job}</span>
                              {exp.startDate && (
                                   <span>
                                        {format(exp.startDate,"MM/yyyy")} -{" "}
                                        {exp.endDate ? format(exp.endDate,"MM/yyyy") : "Այսօր"}
                                   </span>
                              )}
                         </div>
                         <p className="text-xs font-semibold">{[exp.company,exp.city].filter(Boolean).join(" • ")}</p>
                         <div className="text-xs prose">
                              <Markdown>
                                   {exp.jobInfo as string}
                              </Markdown>
                         </div>
                    </div>
               ))}
          </ResumeSectionWrapper>
     )
}

export function EducationSection({resumeData}: ResumeSectionProps){
     const {education, colorHex} = resumeData
     const eduNotEmpty = education?.filter(edu=>Object.values(edu).filter(Boolean).length > 0)
     return !eduNotEmpty?.length ? null : (
          <ResumeSectionWrapper title="Կրթություն" style={{colorHex}}>
               {eduNotEmpty.map((edu,i)=>(
                    <div key={i} className="break-inside-avoid space-y-1">
                         <div className="flex items-center justify-between text-sm font-semibold">
                              <span>{[edu.degree,edu.faculty].filter(Boolean).join(" • ")}</span>
                              {edu.startDate && (
                                   <span>
                                        {format(edu.startDate,"MM/yyyy")} -{" "}
                                        {edu.endDate ? format(edu.endDate,"MM/yyyy") : "Այսօր"}
                                   </span>
                              )}
                         </div>
                         <p className="text-xs font-semibold">{edu.school}</p>
                         <p className="text-xs font-semibold text-muted-foreground">{edu.city}</p>
                    </div>
               ))}
          </ResumeSectionWrapper>
     )
}

export function SkillsSection({resumeData}: ResumeSectionProps){
     const {skills, colorHex, borderStyle} = resumeData
     return !skills?.length ? null : (
          <ResumeSectionWrapper title="Հմտություններ" style={{colorHex}}>
               <div className="flex break-inside-avoid flex-wrap gap-2">
                    {skills.map((skill,i)=>{
                         return skill.name==="" ? null : (
                              <Badge
                                   key={i}
                                   className="rounded-md bg-black hover:bg-black text-white hover:text-white"
                                   style={{
                                        backgroundColor: colorHex,
                                        borderRadius: getBorderRadius(borderStyle as BorderStyles,"badge")
                                   }}
                              >
                                   {skill.name}
                              </Badge>
                         )
                    })}
               </div>
          </ResumeSectionWrapper>
     )
}

export function LanguagesSection({resumeData}: ResumeSectionProps){
     const {languages, colorHex} = resumeData
     return !languages?.length ? null : (
          <ResumeSectionWrapper title="Լեզուներ" style={{colorHex}}>
               <div className="break-inside-avoid space-y-2">
                    {languages.map((lang,i)=>{
                         return lang.name==="" ? null : (
                              <p key={i} className="text-xs"><span className="font-semibold">{lang.name}</span>՝ {getLanguageLevel(lang.percentage || 0)}</p>
                         )
                    })}
               </div>
          </ResumeSectionWrapper>
     )
}

export function LinksSection({resumeData}: ResumeSectionProps){
     const {links, colorHex} = resumeData
     return !links?.length ? null : (
          <ResumeSectionWrapper title="Վեբ հղումներ" style={{colorHex}}>
               <div className="break-inside-avoid flex flex-col items-start justify-center gap-1">
                    {links.map((link,i)=>{
                         return link.name==="" ? null : (
                              <Button key={i} variant="link" size="sm" asChild>
                                   <Link href={link.url||"#"}>{link.name}</Link>
                              </Button>
                         )
                    })}
               </div>
          </ResumeSectionWrapper>
     )
}

export function CoursesSection({resumeData}: ResumeSectionProps){
     const {courses, colorHex} = resumeData;
     const courseNotEmpty = courses?.filter(course=>Object.values(course).filter(Boolean).length > 0)
     return !courseNotEmpty?.length ? null : (
          <ResumeSectionWrapper title="Դասընթացներ" style={{colorHex}}>
               {courseNotEmpty.map((course,i)=>(
                    <div key={i} className="break-inside-avoid space-y-1">
                         <div className="flex items-center justify-between text-sm font-semibold">
                              <span>{course.name}</span>
                              {course.startDate && (
                                   <span>
                                        {format(course.startDate,"MM/yyyy")} -{" "}
                                        {course.endDate ? format(course.endDate,"MM/yyyy") : "Այսօր"}
                                   </span>
                              )}
                         </div>
                         <p className="text-xs font-semibold">{course.institution}</p>
                    </div>
               ))}
          </ResumeSectionWrapper>
     )
}

export function ReferencesSection({resumeData}: ResumeSectionProps){
     const {references, colorHex} = resumeData
     const refNotEmpty = references?.filter(ref=>Object.values(ref).filter(Boolean).length > 0);
     return !refNotEmpty?.length ? null : (
          <ResumeSectionWrapper title="Կոնտակտային հղումներ" style={{colorHex}}>
               <div className="break-inside-avoid grid grid-cols-2">
                    {refNotEmpty.map((ref,i)=>(
                         <div key={i} className="space-y-1">
                              <p className="font-semibold">{ref.fullName}</p>
                              <p className="text-xs font-semibold text-muted-foreground">{[ref.position,ref.company].filter(Boolean).join(" • ")}</p>
                              <p className="text-xs font-semibold">{[ref.phone,ref.email].filter(Boolean).join(" • ")}</p>
                         </div>
                    ))}
               </div>
          </ResumeSectionWrapper>
     )
}