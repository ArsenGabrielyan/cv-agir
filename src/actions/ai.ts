"use server"

import { GenerateDescriptionSchema, GenerateSummarySchema } from "@/schemas/ai"
import { GenerateDescriptionInput, GenerateSummaryInput, WorkExperienceType } from "@/schemas/types"
import {getLanguageLevel} from "@/data/helpers/other"
import gemini from "@/lib/gemini"
import { AI_MODEL, GEN_CONFIG } from "@/data/constants/other"
import { currentUser } from "@/lib/auth"
import { getSubscriptionLevel } from "./subscription-system"
import { getAvailableFeatures } from "@/lib/permission"

export const generateSummary = async(input: GenerateSummaryInput) => {
     const user = await currentUser();
     if(!user || !user.id){
          throw new Error("Այս օգտատերը նույնականացված չէ։")
     }
     const subscriptionLevel = await getSubscriptionLevel(user.id);
     const {canUseAITools} = getAvailableFeatures(subscriptionLevel)

     if(!canUseAITools){
          throw new Error("Այս հմտությունը օգտագործելու համար անցեք պրեմիում տարբերակի։")
     }

     const validatedFields = GenerateSummarySchema.safeParse(input);
     if(!validatedFields.success){
          throw new Error("Բոլոր դաշտերը վալիդացրած չեն")
     }
     const {jobTitle, education, experience, skills, languages} = validatedFields.data

     const sysMsg = `You're a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data. Only return the summary and don't include any other info in the response. Keep it concise, professional, and return the data in Armenian language. Maximum 70 words and Short.`;

     const userMessage = `
     Խնդրում ենք գեներացնել պրոֆեսիոնալ ռեզյումեի նկարագրություն նշված տվյալներից՝

     Մասնագիտություն՝ ${jobTitle || "N/A"}
     Աշխատանքային փորձ՝
     ${experience?.map(exp=>`
          Գործ՝ ${exp.job || "N/A"} ${exp.company || "N/A"} ընկերությունում ${exp.startDate || "N/A"}-ից մինչև ${exp.endDate || "Հիմա"}

          Գործի մասին նկարագրություն՝ ${exp.jobInfo || "N/A"}
          `
     ).join("\n\n")}

     Կրթություն՝
     ${education?.map(edu=>`
          Գիտական աստիճան՝ ${edu.degree || "N/A"} "${edu.school || "N/A"}"-ի "${edu.faculty}" ֆակուլտետում ${edu.startDate || "N/A"}-ից մինչև ${edu.endDate || "Այսօր"}
          `
     ).join("\n\n")}

     Հմտություններ՝
     ${skills?.map(skill=>skill.name).join(", ")}

     Լեզուներ՝
     ${languages?.map(lang=>`
          ${lang.name || "N/A"}՝ ${lang.percentage ? getLanguageLevel(lang.percentage) : "N/A"}
          `
     ).join(", ")}
     `;

     const model = gemini.getGenerativeModel({
          model: AI_MODEL,
          systemInstruction: sysMsg
     });

     const chatSession = model.startChat({
          generationConfig: GEN_CONFIG(),
          history: []
     })
     const result = await chatSession.sendMessage(userMessage);

     const aiResponse = result.response.text()

     if(!aiResponse){
          throw new Error("Չհաջողվեց գեներացնել պատասխանը Արհեստական Բանականության կողմից")
     }

     return aiResponse
}

export const generateWorkExperience = async(input: GenerateDescriptionInput) => {
     const user = await currentUser();
     if(!user || !user.id){
          throw new Error("Այս օգտատերը նույնականացված չէ։")
     }
     const subscriptionLevel = await getSubscriptionLevel(user.id);
     const {canUseAITools} = getAvailableFeatures(subscriptionLevel)

     if(!canUseAITools){
          throw new Error("Այս հմտությունը օգտագործելու համար անցեք պրեմիում տարբերակի։")
     }

     const validatedFields = GenerateDescriptionSchema.safeParse(input);
     if(!validatedFields.success){
          throw new Error("Աշխատանքային փորձի նկարագրությունը վալիդացված չէ")
     }
     const {description} = validatedFields.data;

     const sysMsg = `
     You're a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
     Your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data, but don't add any new ones. Reply in Armenian language and format the Description as a Markdown Format.

     Job Title: <job title>
     Company Name: <company name>
     Start Date: <format: YYYY-MM-DD> (only if provided)
     End Date: <format: YYYY-MM-DD> (only if provided)
     Description: <an optimized description in bullet format might be infered from the job title
     `

     const userMessage = `
     Խնդրում ենք տրամադրել աշխատանքային փորձի մուտք այս նկարագրությունից:
     ${description}
     `

     const model = gemini.getGenerativeModel({
          model: AI_MODEL,
          systemInstruction: sysMsg
     });

     const chatSession = model.startChat({
          generationConfig: GEN_CONFIG("application/json"),
          history: []
     })
     const result = await chatSession.sendMessage(userMessage);

     const aiResponse = result.response.text()

     if(!aiResponse){
          throw new Error("Չհաջողվեց գեներացնել պատասխանը Արհեստական Բանականության կողմից")
     }

     const parsed = JSON.parse(aiResponse)[0];

     const responseObj = {
          job: parsed["Job Title"],
          company: parsed["Company Name"],
          jobInfo: parsed["Description"],
          startDate: parsed["Start Date"],
          endDate: parsed["End Date"],
     } satisfies WorkExperienceType

     return responseObj
}