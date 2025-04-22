"use server"

import { GenerateDescriptionSchema, GenerateLetterBodySchema, GenerateSummarySchema } from "@/schemas/ai"
import { GenerateDescriptionInput, GenerateLetterBodyInput, GenerateSummaryInput, WorkExperienceType } from "@/data/types/schema"
import {getLanguageLevel} from "@/data/helpers"
import gemini from "@/lib/gemini"
import { AI_MODEL, GEN_CONFIG } from "@/data/constants/other"
import { currentUser } from "@/lib/auth"
import { getSubscriptionLevel } from "./subscription-system"
import { getAvailableFeatures } from "@/lib/permission"
import DOMPurify from "isomorphic-dompurify"
import { checkLimiter, clearLimiter, getIpAddress, incrementLimiter } from "@/lib/limiter"

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
     const limiterKey = `ai:${user.id || await getIpAddress()}`;
     if(checkLimiter(limiterKey,10)){
          throw new Error("Շատ հաճախ եք փորձում։ Խնդրում ենք փորձել ավելի ուշ")
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
          incrementLimiter(limiterKey,60_000)
          throw new Error("Չհաջողվեց գեներացնել պատասխանը Արհեստական Բանականության կողմից")
     }
     clearLimiter(limiterKey)
     return DOMPurify.sanitize(aiResponse,{
          ALLOWED_TAGS: ["b", "i", "strong", "p", "ul", "li", "br"],
          ALLOWED_ATTR: [],
     })
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
     const limiterKey = `ai:${user.id || await getIpAddress()}`;
     if(checkLimiter(limiterKey,10)){
          throw new Error("Շատ հաճախ եք փորձում։ Խնդրում ենք փորձել ավելի ուշ")
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
          incrementLimiter(limiterKey,60_000)
          throw new Error("Չհաջողվեց գեներացնել պատասխանը Արհեստական Բանականության կողմից")
     }
     clearLimiter(limiterKey)
     const parsed = JSON.parse(aiResponse)[0];

     const responseObj = {
          job: parsed["Job Title"],
          company: parsed["Company Name"],
          jobInfo: DOMPurify.sanitize(parsed["Description"],{
               ALLOWED_TAGS: ["b", "i", "strong", "p", "ul", "li", "br"],
               ALLOWED_ATTR: [],
          }),
          startDate: parsed["Start Date"],
          endDate: parsed["End Date"],
     } satisfies WorkExperienceType

     return responseObj
}

export const generateCoverLetterBody = async(input: GenerateLetterBodyInput) => {
     const user = await currentUser();
     if(!user || !user.id){
          throw new Error("Այս օգտատերը նույնականացված չէ։")
     }
     const subscriptionLevel = await getSubscriptionLevel(user.id);
     const {canUseAITools} = getAvailableFeatures(subscriptionLevel)

     if(!canUseAITools){
          throw new Error("Այս հմտությունը օգտագործելու համար անցեք պրեմիում տարբերակի։")
     }

     const validatedFields = GenerateLetterBodySchema.safeParse(input);
     if(!validatedFields.success){
          throw new Error("Բոլոր դաշտերը վալիդացրած չեն")
     }
     const limiterKey = `ai:${user.id || await getIpAddress()}`;
     if(checkLimiter(limiterKey,10)){
          throw new Error("Շատ հաճախ եք փորձում։ Խնդրում ենք փորձել ավելի ուշ")
     }

     const {jobTitle, fname, lname, recipientName, recipientTitle} = validatedFields.data

     const sysMsg = `You're a job cover letter generator AI. Your task is to write a professional cover letter given the user's provided data and recipient's data. Only return the cover letter in markdown and make 3-4 paragraphs explaining why this user is perfect candidate for a specific job. Keep it concise, professional, avoid headings, and return the data in Armenian language.`;

     const userMessage = `
     Խնդրում ենք գեներացնել պրոֆեսիոնալ ուղեկցող նամակ նշված տվյալներից՝

     Աշխատողի անուն ազգանուն՝ ${fname || "N/A"} ${lname || "N/A"}
     Մասնագիտություն՝ ${jobTitle || "N/A"}
     
     Գործատուի անուն ազգանուն՝ ${recipientName || "N/A"}
     Գործատուի մասնագիտություն՝ ${recipientTitle || "N/A"}

     բայց սկսիր "Հարգելի պարոն <ազգանուն> նախադասությունից" և վերջացրու "Հարգանքով՝ <աշխատողի անուն ազգանուն>"-ով
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
          incrementLimiter(limiterKey,60_000)
          throw new Error("Չհաջողվեց գեներացնել պատասխանը Արհեստական Բանականության կողմից")
     }
     clearLimiter(limiterKey)
     return DOMPurify.sanitize(aiResponse,{
          ALLOWED_TAGS: ["b", "i", "strong", "p", "ul", "li", "br"],
          ALLOWED_ATTR: [],
     })
}