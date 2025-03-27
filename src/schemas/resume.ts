import * as z from "zod"
export const optionalString = z.optional(z.string().trim()).or(z.literal(""))
export const optionalEmailString = z.optional(z.string().email("Մուտքագրեք վավերական էլ․ փոստ").trim()).or(z.literal(""))

export const ResumeLinkSchema = z.object({
     name: optionalString,
     url: optionalString
})

export const WorkExperienceSchema = z.object({
     job: optionalString,
     company: optionalString,
     startDate: optionalString,
     endDate: optionalString,
     city: optionalString,
     jobInfo: optionalString,
})
.refine(data=>{
     if(data.startDate && data.endDate){
          const start = new Date(data.startDate);
          const end = new Date(data.endDate)
          return end >= start
     }
     return true
},{
     message: "Ավարտի ամսաթիվը պետք է լինի մեկնարկի ամսաթվից հետո:",
     path: ["endDate"]
})

export const ResumeEducationSchema = z.object({
     degree: optionalString,
     faculty: optionalString,
     startDate: optionalString,
     endDate: optionalString,
     school: optionalString,
     city: optionalString
})
.refine(data=>{
     if(data.startDate && data.endDate){
          const start = new Date(data.startDate);
          const end = new Date(data.endDate)
          return end >= start
     }
     return true
},{
     message: "Ավարտի ամսաթիվը պետք է լինի մեկնարկի ամսաթվից հետո:",
     path: ["endDate"]
})

export const ResumeCourseSchema = z.object({
     name: optionalString,
     institution: optionalString,
     startDate: optionalString,
     endDate: optionalString,
})
.refine(data=>{
     if(data.startDate && data.endDate){
          const start = new Date(data.startDate);
          const end = new Date(data.endDate)
          return end >= start
     }
     return true
},{
     message: "Ավարտի ամսաթիվը պետք է լինի մեկնարկի ամսաթվից հետո:",
     path: ["endDate"]
})

export const ResumeReferenceSchema = z.object({
     fullName: optionalString,
     position: optionalString,
     company: optionalString,
     phone: optionalString,
     email: optionalEmailString
})

export const ResumeSkillSchema = z.object({
     name: optionalString,
     percentage: z.optional(z.number().int("Թիվը պետք է լինի ամբողջ թիվ"))
})