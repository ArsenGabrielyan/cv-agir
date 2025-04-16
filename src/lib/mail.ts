import {Resend} from "resend"
import { absoluteUrl } from "./utils";
import { env } from "@/lib/env";
import VerificationTemplate from "../emails/verification";
import PassResetTemplate from "@/emails/pass-reset";
import TwoFactorTemplate from "@/emails/two-factor";
import MessageTemplate from "@/emails/contact-message";

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
          react: MessageTemplate({name,email,phone,subject,message})
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
     const {error} = await resend.emails.send({
          from: onboardingEmail,
          to: email,
          subject: "Հաստատեք Ձեր էլ․ հասցեն",
          react: VerificationTemplate({firstName,confirmLink})
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
     await resend.emails.send({
          from: onboardingEmail,
          to: email,
          subject: "Գաղտնաբառի վերականգնում",
          react: PassResetTemplate({firstName,resetLink}),
     })
}

export const sendTwoFactorEmail = async (
     name: string,
     email: string,
     token: string
) => {
     const firstName = name.split(" ")[0];
     await resend.emails.send({
          from: onboardingEmail,
          to: email,
          subject: "Երկաստիճան վավերացում",
          react: TwoFactorTemplate({firstName,token})
     })
}