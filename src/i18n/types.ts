import hyLanding from "../../i18n/hy/landing-page.json"
import hyCommon from "../../i18n/hy/common.json"
import hyForm from "../../i18n/hy/form.json"
import hyValidation from "../../i18n/hy/validation.json"

export type LangCodeType = 'en' | 'hy';
type CountryCodeType = 'us' | 'am';
export interface ILanguage{
     code: LangCodeType,
     countryCode: CountryCodeType,
     label: string
}
export type MessageSchema = (
     typeof hyLanding &
     typeof hyCommon &
     typeof hyForm &
     typeof hyValidation
);