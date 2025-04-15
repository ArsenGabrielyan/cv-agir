import {Resend} from "resend"
import { absoluteUrl } from "./utils";
import { env } from "@/lib/env";
import VerificationTemplate from "../emails/verification";
import { render } from "@react-email/render";

const resend = new Resend(env.RESEND_API_KEY);
const onboardingEmail = `CV-ագիր <${env.ONBOARDING_EMAIL}>`

export const sendMessage = async (
     name: string,
     email: string,
     phone: string,
     subject: string,
     message: string
) => {
     const {error} = await resend.emails.send({
          from: onboardingEmail,
          to: env.DEV_EMAIL,
          subject,
          html: `
               <h1 style="color: #002a4f">Նոր Հաղորդագրություն</h1>
               <p><strong>📌 Անուն:</strong> ${name}</p>
               <p><strong>📧 Էլ․ հասցե:</strong> ${email}</p>
               <p><strong>📞 Հեռախոսահամար:</strong> ${phone}</p>
               <p><strong>📝 Թեմա:</strong> ${subject}</p>
               <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
                    <p>${message}</p>
               </div>
               <p style="margin-top: 20px; color: #666; font-size: 12px;">Այս հաղորդագրությունն ուղարկվել է Ձեր կայքի միջոցով:</p>
          `
     })
     if(error){
          console.error(error)
     }
}

export const sendVerificationEmail = async(
     name: string,
     email: string,
     token: string
) => {
     const confirmLink = absoluteUrl(`/auth/new-verification?token=${token}`);
     const firstName = name.split(" ")[0];
     const html = render(VerificationTemplate({firstName,confirmLink}))
     const {error} = await resend.emails.send({
          from: onboardingEmail,
          to: email,
          subject: "Հաստատեք Ձեր էլ․ հասցեն",
          html: await html
     })
     if(error){
          console.error(error)
     }
}

export const sendPasswordResetEmail = async (
     name: string,
     email: string,
     token: string
) => {
     const resetLink = absoluteUrl(`/auth/new-password?token=${token}`);
     const firstName = name.split(" ")[0];
     const currYear = new Date().getFullYear();
     await resend.emails.send({
          from: onboardingEmail,
          to: email,
          subject: "Գաղտնաբառի վերականգնում",
          html: `
               <h1 style="color: #002a4f">Գաղտնաբառի վերականգնում</h1>
               <p>Բարև ${firstName},</p>
               <p>Դուք խնդրել եք վերականգնել Ձեր գաղտնաբառը։ Խնդրում ենք սեղմել ներքևի կոճակը՝ նոր գաղտնաբառ սահմանելու համար։</p>
               <p>🔗 <a href="${resetLink}">Վերականգնել գաղտնաբառը</a></p>
               <p>Կամ պատճենեք այս հղումը և տեղադրեք Ձեր վեբ դիտարկիչում։</p>
               <p>🔗 <a href="${resetLink}">${resetLink}</a></p>
               <p style="color: #666; font-size: 14px;">Եթե Դուք չեք խնդրել գաղտնաբառի վերականգնում, կարող եք անտեսել այս նամակը։</p>
               <p style="color: #666; font-size: 14px;">© ${currYear} CV-ագիր</p>
          `
     })
}

export const sendTwoFactorEmail = async (
     name: string,
     email: string,
     token: string
) => {
     const firstName = name.split(" ")[0];
     const currYear = new Date().getFullYear();
     await resend.emails.send({
          from: onboardingEmail,
          to: email,
          subject: "Երկաստիճան վավերացում",
          html: `
               <h1 style="color: #002a4f">Երկաստիճան վավերացում</h1>
               <p>Բարև ${firstName},</p>
               <p>Ձեր հաշվի անվտանգության ապահովելու համար մուտք գործելիս անհրաժեշտ է մուտքագրել այս հաստատման կոդը։</p>
               <h2 style="margin: 20px 0; background-color: #f3f3f3; padding: 10px; border-radius: 5px;">${token}</h2>
               <p>Այս կոդը վավեր է միայն <strong>5 րոպե</strong>, խնդրում ենք մուտքագրել այն հնարավորինս արագ:</p>
               <p style="color: #666; font-size: 14px;">Եթե Դուք չեք խնդրել այս հաստատման կոդը, խնդրում ենք անտեսել այս նամակը:</p>
               <p style="color: #666; font-size: 14px;">© ${currYear} CV-ագիր</p>
          `
     })
}