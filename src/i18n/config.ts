import { ILanguage, LangCodeType, MessageSchema } from "./types";

export const languages = [
     {code: "hy", countryCode: "am", label: "Հայերեն"},
     {code: "en", countryCode: "us", label: "English"},
] as const satisfies readonly ILanguage[];

export const messages = [
     "common",
     "landing-page",
     "about"
] as const

export const locales: LangCodeType[] = languages.map(lang=>lang.code);
export const defaultLocale: LangCodeType = "hy";

export async function loadMessages(locale: LangCodeType): Promise<MessageSchema>{
     const [common, landingPage, about] = await Promise.all(
          messages.map(msg=>
               import(`../../i18n/${locale}/${msg}.json`).then(m=>m.default)
          )
     );
     return {
          ...common,
          ...landingPage,
          ...about
     }
}