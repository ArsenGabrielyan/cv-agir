"use server"
import { sendMessage } from "@/lib/mail";
import { ContactSchema } from "@/schemas"
import { ContactFormType } from "@/data/types/schema";
import { checkLimiter, clearLimiter, getIpAddress, incrementLimiter } from "@/lib/limiter";
import { verifyCaptchaToken } from "@/lib/captcha";

export const submitContactForm = async (token: string,values: ContactFormType) => {
     if(!token){
          return {error: "Token-ը չի գտնվել։"}
     }

     const validatedFields = ContactSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացված չեն"}
     }

     const {name,email,phone,subject,message} = validatedFields.data;

     const ip = await getIpAddress();
     const limiterKey = `contact:${ip}`;

     const verificationResult = await verifyCaptchaToken(token);

     if(!verificationResult || !verificationResult.success || verificationResult.score < 0.5) {
          incrementLimiter(limiterKey,60_000)
          return {error: "Կասկածելի ակտիվություն։ Captcha-ի ստուգումը չստացվեց։"}
     }

     if(checkLimiter(limiterKey,3)){
          return {error: "Շատ հաճախ եք փորձում։ Խնդրում ենք փորձել ավելի ուշ"}
     }

     try{
          await sendMessage(name,email,phone,subject,message);
          clearLimiter(limiterKey)
          return {success: "Հաղորդագրությունը ուղարկված է!"}
     } catch {
          incrementLimiter(limiterKey,60_000)
          return {error: "Ինչ-որ բան սխալ գնաց։"}
     }
}