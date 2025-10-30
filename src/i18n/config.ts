import { ILanguage, LangCodeType, MessageSchema } from "./types";
import { Locale } from "date-fns/locale";
import {hy,enUS} from "date-fns/locale"

export const languages = [
     {code: "hy", countryCode: "am", label: "Հայերեն"},
     {code: "en", countryCode: "us", label: "English"},
] as const satisfies readonly ILanguage[];

export const dateFNSLocales: Record<LangCodeType, Pick<Locale,"formatDistance" | "formatLong" | "localize" | "options">> = {
     hy,
     en: enUS
}

export const messages = [
     "common",
     "landing-page",
     "form",
     "validation",
     "audit-log",
     "email-templates",
     "dashboard",
     "subscription"
] as const

export const locales: LangCodeType[] = languages.map(lang=>lang.code);
export const defaultLocale: LangCodeType = "hy";

export async function loadMessages(locale: LangCodeType): Promise<MessageSchema>{
     const [common, landingPage, form, validation, auditLog, emailTemplates, dashboard, subscription] = await Promise.all(
          messages.map(msg=>
               import(`../../i18n/${locale}/${msg}.json`).then(m=>m.default)
          )
     );
     return {
          ...common,
          ...landingPage,
          ...form,
          ...validation,
          ...auditLog,
          ...emailTemplates,
          ...dashboard,
          ...subscription
     }
}