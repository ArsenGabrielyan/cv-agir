import { Resume } from "@prisma/client";
import { PLACEHOLDERS } from "../constants/other"
import { ResumeFormType } from "@/schemas/types";
import { PlaceholdersName } from "../types";
import Handlebars from "handlebars"
import { marked } from "marked"
import { BorderStyles } from "@/app/(protected)/editor/style-buttons/border-style-button";

export const getRandomPlaceholder = (placeholderKey: PlaceholdersName) => {
     const placeholders = PLACEHOLDERS[placeholderKey];
     const randomIndex = Math.floor(Math.random()*placeholders.length);
     return placeholders[randomIndex];
}

export const mapToResumeValues = (data: Resume): ResumeFormType => ({
     id: data.id || undefined,
     title: data.title || undefined,
     description: data?.description || undefined,
     fname: data.fname || undefined,
     lname: data.lname || undefined,
     jobTitle: data.jobTitle || undefined,
     phone: data.phone || undefined,
     address: data.address || undefined,
     profileImg: data.profileImg || undefined,
     email: data.email || undefined,
     links: data.links.map(link=>({
          name: link.name || undefined,
          url: link.url || undefined
     })) || undefined,
     summary: data.summary || undefined,
     experience: data.experience.map(exp=>({
          job: exp.job || undefined,
          company: exp.company || undefined,
          startDate: exp.startDate?.toISOString().split("T")[0],
          endDate: exp.endDate?.toISOString().split("T")[0],
          city: exp.city || undefined,
          jobInfo: exp.jobInfo || undefined
     })) || undefined,
     education: data.education.map(edu=>({
          degree: edu.degree || undefined,
          faculty: edu.faculty || undefined,
          startDate: edu.startDate?.toISOString().split("T")[0],
          endDate: edu.endDate?.toISOString().split("T")[0],
          school: edu.school || undefined,
          city: edu.city || undefined
     })) || undefined,
     courses: data.courses.map(course=>({
          name: course.name || undefined,
          institution: course.institution || undefined,
          startDate: course.startDate?.toISOString().split("T")[0],
          endDate: course.endDate?.toISOString().split("T")[0],
     })) || undefined,
     references: data.references.map(ref=>({
          fullName: ref.fullName || undefined,
          position: ref.position || undefined,
          company: ref.company || undefined,
          phone: ref.phone || undefined,
          email: ref.email || undefined
     })) || undefined,
     skills: data.skills.map(skill=>({
          name: skill.name || undefined,
          percentage: skill.percentage || undefined
     })) || undefined,
     languages: data.languages.map(lang=>({
          name: lang.name || undefined,
          percentage: lang.percentage || undefined
     })) || undefined,
     hobbies: data.hobbies || undefined,
})

export function getLanguageLevel(level: number){
     if(level>=90 && level <= 100) return "Հմուտ"
     if(level>=70 && level <= 90) return "Խոսակցական"
     if(level>=40 && level <= 70) return "Սկսնակ"
     return "Նվազագույն"
}

export function compileHTML(html: string, data: ResumeFormType){
     Handlebars.registerHelper({
          eq: (v1, v2) => v1 === v2,
          ne: (v1, v2) => v1 !== v2,
          lt: (v1, v2) => v1 < v2,
          gt: (v1, v2) => v1 > v2,
          lte: (v1, v2) => v1 <= v2,
          gte: (v1, v2) => v1 >= v2,
          and(...args) {
               return Array.prototype.every.call(args, Boolean);
          },
          or(...args) {
               return Array.prototype.slice.call(args, 0, -1).some(Boolean);
          },
          getProficiency(value){
               const level = +value;
               return getLanguageLevel(level);
          },
          mdToHtml(content){
               const markdown = marked(content,{
                    async: false
               })
               return new Handlebars.SafeString(markdown)
          }
     })
     const htmlTemplate = Handlebars.compile<ResumeFormType>(html);
     return htmlTemplate(data)
}

export function getBorderRadius(borderStyle: BorderStyles,type: "default" | "badge" = "default"){
     if(borderStyle===BorderStyles.Square) return "0px"
     if(borderStyle===BorderStyles.Circle) return "9999px"
     return type==="default" ? "10%" : "8px"
}

export function fileReplacer(_: unknown, value: unknown){
     return value instanceof File ? {
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified,
     } : value
}

export const isObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id)