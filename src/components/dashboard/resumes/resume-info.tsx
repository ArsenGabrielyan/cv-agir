"use client"
import { Resume } from "@prisma/client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Mail, MapPin, Phone, } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getLanguageLevel } from "@/data/helpers"
import Markdown from "markdown-to-jsx"
import {format} from "date-fns"

interface ResumeInfoProps{
     data: Resume
}
export default function ResumeInfo({data}: ResumeInfoProps){
     const {fname, lname, jobTitle, phone, address, profileImg, email, summary, hobbies, links, experience, education, courses, references, skills, languages} = data
     const isEmpty = Object.values({fname, lname, jobTitle, phone, address, profileImg, email, summary, hobbies, links, experience, education, courses, references, skills, languages}).every((val) => Array.isArray(val) ? !(val && val.length!==0) : !val);
     return !isEmpty ? (
          <div className="max-w-screen-xl w-full p-5 space-y-6">
               <div className="bg-card text-card-foreground border shadow p-4 rounded-xl flex flex-col items-center justify-center gap-3">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full">
                         {(fname || lname || jobTitle) && (
                              <>
                                   <Avatar className="aspect-square size-20 md:size-32">
                                        <AvatarImage src={profileImg || undefined}/>
                                        <AvatarFallback className="text-4xl md:text-6xl">
                                             {fname?.split("")[0]}
                                             {lname?.split("")[0]}
                                        </AvatarFallback>
                                   </Avatar>
                                   <div className="text-center">
                                        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">{fname} {lname}</h1>
                                        <p className="text-lg">{jobTitle}</p>
                                   </div>
                              </>
                         )}
                         {(address || phone || email) && (
                              <ul className="flex flex-col items-start justify-start gap-3 w-full md:w-fit flex-wrap">
                                   <li className="flex gap-3 items-center justify-center md:justify-start w-full text-sm md:text-base"><Phone className="size-4 md:size-6"/> {phone}</li>
                                   <li className="flex gap-3 items-center justify-center md:justify-start w-full text-sm md:text-base"><MapPin className="size-4 md:size-6"/> {address}</li>
                                   <li className="flex gap-3 items-center justify-center md:justify-start w-full text-sm md:text-base"><Mail className="size-4 md:size-6"/> {email}</li>
                              </ul>
                         )}
                    </div>
                    {(links && links.length!==0) &&(
                         <div className="flex justify-between items-center gap-3 flex-wrap">
                              {links.map(({name,url},i)=>(
                                   <Button key={i} variant="link" className="flex-1" asChild>
                                        <Link href={url || "#"}>{name}</Link>
                                   </Button>
                              ))}
                         </div>
                    )}
               </div>
               <div className="space-y-6 text-center md:text-left">
                    {summary && (
                         <section className="space-y-3">
                              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Իմ Մասին</h2>
                              <p>{summary}</p>
                         </section>
                    )}
                    {(experience && experience.length!==0) && (
                         <section className="space-y-3">
                              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Աշխատանքային փորձ</h2>
                              <div className="space-y-5">
                                   {experience.map((exp,i)=>(
                                        <div key={i} className="space-y-1">
                                             <div className="flex flex-col md:flex-row items-center justify-center md:justify-between font-semibold gap-3">
                                                  <span>{exp.job} {exp.company} ընկերությունում</span>
                                                  {exp.startDate && (
                                                       <span>
                                                            {format(exp.startDate,"MM/yyyy")} -{" "}
                                                            {exp.endDate ? format(exp.endDate,"MM/yyyy") : "Այսօր"}
                                                       </span>
                                                  )}
                                             </div>
                                             {exp.jobInfo && (
                                                  <div className="prose dark:prose-invert">
                                                       <Markdown className="text-left">
                                                            {exp.jobInfo}
                                                       </Markdown>
                                                  </div>
                                             )}
                                             
                                        </div>
                                   ))}
                              </div>
                         </section>
                    )}
                    {(education && education.length!==0) && (
                         <section className="space-y-3">
                              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Կրթություն</h2>
                              <div className="space-y-5">
                                   {education.map((edu,i)=>(
                                        <div key={i} className=" space-y-2 md:space-y-1">
                                             <div className="flex items-center justify-between font-semibold flex-col md:flex-row">
                                                  <span>{[edu.degree,edu.faculty].filter(Boolean).join(" • ")}</span>
                                                  {edu.startDate && (
                                                       <span>
                                                            {format(edu.startDate,"MM/yyyy")} -{" "}
                                                            {edu.endDate ? format(edu.endDate,"MM/yyyy") : "Այսօր"}
                                                       </span>
                                                  )}
                                             </div>
                                             <p className="text-sm font-semibold">{edu.school}</p>
                                             <p className="text-sm font-semibold text-muted-foreground">{edu.city}</p>
                                        </div>
                                   ))}
                              </div>
                         </section>
                    )}
                    {(skills && skills.length!==0) && (
                         <section className="space-y-3">
                              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Հմտություններ</h2>
                              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                   {skills.map((skill,i)=>(
                                        <Badge key={i}>{skill.name}</Badge>
                                   ))}
                              </div>
                         </section>
                    )}
                    {(languages && languages.length!==0) && (
                         <section className="space-y-3">
                              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Լեզուներ</h2>
                              <ul className="flex justify-between items-center flex-wrap gap-3">
                                   {languages.map((lang,i)=>(
                                        <li key={i} className="flex-1"><span className="font-semibold">{lang.name}`</span>{" "+getLanguageLevel(lang.percentage || 0)}</li>
                                   ))}
                              </ul>
                         </section>
                    )}
                    {hobbies && (
                         <section className="space-y-3">
                              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Հոբբիներ</h2>
                              <p>{hobbies}</p>
                         </section>
                    )}
                    {(courses && courses.length!==0) && (
                         <section className="space-y-3">
                              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Դասընթացներ</h2>
                              {courses.map((course,i)=>(
                                   <div key={i} className="space-y-2 md:space-y-1">
                                        <div className="flex items-center justify-between font-semibold flex-col md:flex-row">
                                             <span>{course.name}</span>
                                             {course.startDate && (
                                                  <span>
                                                       {format(course.startDate,"MM/yyyy")} -{" "}
                                                       {course.endDate ? format(course.endDate,"MM/yyyy") : "Այսօր"}
                                                  </span>
                                             )}
                                        </div>
                                        <p className="text-sm font-semibold">{course.institution}</p>
                                   </div>
                              ))}
                         </section>
                    )}
                    {(references && references.length!==0) && (
                         <section className="space-y-3">
                              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Կոնտակտային հղումներ</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {references.map((ref,i)=>(
                                        <div key={i} className="space-y-1">
                                             <p className="font-semibold">{ref.fullName}</p>
                                             <p className="text-sm font-semibold text-muted-foreground">{[ref.position,ref.company].filter(Boolean).join(" • ")}</p>
                                             <p className="text-sm font-semibold">{[ref.phone,ref.email].filter(Boolean).join(" • ")}</p>
                                        </div>
                                   ))}
                              </div>
                         </section>
                    )}
               </div>
          </div>
     ) : (
          <div className="px-3 py-9 text-center">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Այս Ռեզյումեի մեջ տվյալներ չկա։</h1>
          </div>
     )
}