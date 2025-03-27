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
          name: link.name,
          url: link.url
     })) || undefined,
     summary: data.summary || undefined,
     experience: data.experience.map(exp=>({
          job: exp.job,
          company: exp.company,
          startDate: exp.startDate.toISOString().split("T")[0],
          endDate: exp.endDate.toISOString().split("T")[0],
          city: exp.city,
          jobInfo: exp.jobInfo
     })) || undefined,
     education: data.education.map(edu=>({
          degree: edu.degree,
          faculty: edu.faculty,
          startDate: edu.startDate.toISOString().split("T")[0],
          endDate: edu.endDate.toISOString().split("T")[0],
          school: edu.school,
          city: edu.city
     })) || undefined,
     courses: data.courses.map(course=>({
          name: course.name,
          institution: course.institution,
          startDate: course.startDate.toISOString().split("T")[0],
          endDate: course.endDate.toISOString().split("T")[0],
     })) || undefined,
     references: data.references.map(ref=>({
          fullName: ref.fullName,
          position: ref.position,
          company: ref.company,
          phone: ref.phone,
          email: ref.email
     })) || undefined,
     skills: data.skills.map(skill=>({
          name: skill.name,
          percentage: skill.percentage
     })) || undefined,
     languages: data.languages.map(lang=>({
          name: lang.name,
          percentage: lang.percentage
     })) || undefined,
     hobbies: data.hobbies || undefined,
     qrImg: data.qrImg || undefined
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