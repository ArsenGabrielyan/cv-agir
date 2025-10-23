import hyLanding from "../../i18n/hy/landing-page.json"
import hyCommon from "../../i18n/hy/common.json"

export type LangCodeType = 'en' | 'hy';
type CountryCodeType = 'us' | 'am';
export interface ILanguage{
     code: LangCodeType,
     countryCode: CountryCodeType,
     label: string
}
export type MessageSchema = (
     typeof hyLanding &
     typeof hyCommon 
);