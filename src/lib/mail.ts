import {Resend} from "resend"
import { absoluteUrl } from "./utils";
import { env } from "@/lib/env";
import VerificationTemplate from "../emails/verification";
import PassResetTemplate from "@/emails/pass-reset";
import TwoFactorTemplate from "@/emails/two-factor";
import MessageTemplate from "@/emails/contact-message";
import { getTranslations } from "next-intl/server";

const resend = new Resend(env.RESEND_API_KEY);

export const sendMessage = async (
     name: string,
     email: string,
     phone: string,
     subject: string,
     message: string
) => {
     const t = await getTranslations("index");
     const emailTxt = await getTranslations("email")
     const {error} = await resend.emails.send({
          from: emailTxt("onboarding",{
               title: t("title"),
               email: env.ONBOARDING_EMAIL
          }),
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
     const t = await getTranslations("index")
     const emailTxt = await getTranslations("email")
     const {error} = await resend.emails.send({
          from: emailTxt("onboarding",{
               title: t("title"),
               email: env.ONBOARDING_EMAIL
          }),
          to: email,
          subject: emailTxt("subject-titles.verification"),
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
     const t = await getTranslations("index")
     const emailTxt = await getTranslations("email")
     await resend.emails.send({
          from: emailTxt("onboarding",{
               title: t("title"),
               email: env.ONBOARDING_EMAIL
          }),
          to: email,
          subject: emailTxt("subject-titles.pass-reset"),
          react: PassResetTemplate({firstName,resetLink}),
     })
}

export const sendTwoFactorEmail = async (
     name: string,
     email: string,
     token: string
) => {
     const firstName = name.split(" ")[0];
     const t = await getTranslations("index")
     const emailTxt = await getTranslations("email")
     await resend.emails.send({
          from: emailTxt("onboarding",{
               title: t("title"),
               email: env.ONBOARDING_EMAIL
          }),
          to: email,
          subject: emailTxt("subject-titles.2fa"),
          react: TwoFactorTemplate({firstName,token})
     })
}