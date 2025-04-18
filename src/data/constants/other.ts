import { UserPlan } from "@db/client"
import { IResumeDynamicFields, PlaceholdersName } from "../types"

/**
 * Մասնագիտությունների ցուցակ
 */
export const JOB_NAMES: string[] = ['Բժիշկ', 'Ճարտարապետ', 'Մենեջեր', 'Քարտուղարուհի', 'Իրավաբան', 'Հաշվապահ', 'Ուսուցիչ', 'Ծրագրավորող', 'Ատամնաբույժ', 'Օգնական', 'Գրադարանավար', 'Խորհրդատու', 'Բեռնատարի վարորդ', 'Գնացքի վարորդ', 'Մսագործ', 'Շինարար', 'Ատաղձագործ', 'Էլեկտրիկ', 'Ջրմուղագործ', 'Մեխանիկ', 'Հավաքարար', 'Այգեպան', 'Բուժքույր', 'Օդաչու', 'Բորտուղեկցորդուհի', 'Մանկաբարձուհի', 'Խոհարար', 'Մատուցող', 'Դերձակ', 'Գանձապահ', 'Ընդունարանի աշխատակից', 'Օպտիկայի մասնագետ', 'Ավտոբուսի վարորդ', 'Թիկնապահ', 'Լուսանկարիչ', 'Մրցավար', 'Թղթակից', 'Դերասան', 'Պարուհի', 'Մարզիչ', 'Երգիչ', 'Նկարիչ', 'Դիզայներ']

/**
 * ԲՈՒՀ-երում գիտական աստիճանների ցուցակ
 */
export const DEGREES: string[] = ["Բակալավր","Մագիստրատուրա","Ասպիրանտուրա","Դիպլոմ"]

export const ARR_FIELD_INITIAL_VALUES: IResumeDynamicFields = {
     courses: {
          name: "",
          institution: "",
          startDate: "",
          endDate: ""
     },
     education: {
          degree: "",
          faculty: "",
          city: "",
          school: "",
          startDate: "",
          endDate: ""
     },
     experience: {
          city: "",
          job: "",
          company: "",
          jobInfo: "",
          startDate: "",
          endDate: ""
     },
     languages: {
          name: "",
          percentage: 0
     },
     links: {
          name: "",
          url: ""
     },
     references: {
          fullName: "",
          position: "",
          company: "",
          phone: "",
          email: "",
     },
     skills: {
          name: "",
          percentage: 0
     }
}

export const PLACEHOLDERS: Record<PlaceholdersName,string[]> = {
     jobName: JOB_NAMES,
     degrees: DEGREES
}

export const AI_MODEL = "gemini-2.0-flash-lite"

export const GEN_CONFIG = (type = "text/plain") => ({
     temperature: 1,
     topP: 0.95,
     topK: 40,
     maxOutputTokens: 8192,
     responseModalities: [],
     responseMimeType: type,
})

export const MAX_FREE_RESUMES = 3;

export const MAX_RESUME_MAP: Record<UserPlan, number> = {
     free: MAX_FREE_RESUMES,
     premium: Infinity
}

export const CREDIT_CARD_BRANDS = {
     mir: /^220[0-4]\d{12}$/,
     discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
     amex: /^3(4|7)[0-9]{13}$/,
     diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
     jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
     visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
     mastercard: /^5[1-5][0-9]{14}$/,
     unionPay: /^(62[0-9]{14,17})$/,
     arca: /^9[0-9]{15}$/,
}
export const BANKS = [
     {name: "aeb", startNumber: "0512102", title: "Հայէկոնոմբանկ"},
     {name: "idbank", startNumber: "3182900", title: "IDBank"},
     {name: "evocabank", startNumber: "0512202", title: "Evocabank"},
     {name: "inecobank", startNumber: "5788900", title: "Inecobank"},
     {name: "ameriabank", startNumber: "0830500", title: "Ameriabank"},
     {name: "ardshinbank", startNumber: "4543000", title: "Ardshinbank"},
]