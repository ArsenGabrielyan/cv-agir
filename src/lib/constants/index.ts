import { AuditAction, UserPlan } from "@db"
import { IResumeDynamicFields, QuickFilterType } from "../../lib/types"

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
export const GET_BANKS = (aebName: string) => [
     {name: "aeb", startNumber: "0512102", title: aebName},
     {name: "idbank", startNumber: "3182900", title: "IDBank"},
     {name: "evocabank", startNumber: "0512202", title: "Evocabank"},
     {name: "inecobank", startNumber: "5788900", title: "Inecobank"},
     {name: "ameriabank", startNumber: "0830500", title: "Ameriabank"},
     {name: "ardshinbank", startNumber: "4543000", title: "Ardshinbank"},
]

export const AUDIT_QUICK_FILTERS: Record<QuickFilterType,AuditAction[]> = {
     errors: ["NO_ADMIN_ACCESS","UNAUTHORIZED","ACTION_ERROR","RATE_LIMIT_EXCEEDED","VALIDATION_ERROR","INVALID_CAPTCHA","CONTACT_FORM_SUBMISSION_ERROR","AI_ERROR","FAILED_2FA_ATTEMPT","REGISTRATION_ERROR","VERIFICATION_ERROR","PASSWORD_CHANGE_ERROR","LOGIN_ERROR"],
     auth: ["LOGIN_SUCCESS","PASSWORD_CHANGE_REQUEST","PASSWORD_CHANGED","VERIFICATION_REQUEST","EMAIL_VERIFIED","USER_REGISTERED","TWO_FACTOR_VERIFIED","LOGOUT","OAUTH_SIGNIN"],
     coverLetter: ["COVER_LETTER_CREATED","COVER_LETTER_DELETED","COVER_LETTER_UPDATED"],
     resume: ["RESUME_CREATED","RESUME_DELETED","RESUME_UPDATED","CV_PAGE_VIEWED"],
     subscription: ["CREDIT_CARD_ADDED","CREDIT_CARD_DELETED","CREDIT_CARD_UPDATED","PLAN_CANCELLED","PLAN_UPGRADED","PLAN_RENEWED"],
     ai: ["AI_COVER_LETTER_GENERATED","AI_EXPERIENCE_GENERATED","AI_SUMMARY_GENERATED"],
     app: ["CONTACT_FORM_SUBMITTED","ACCOUNT_UPDATED","TWO_FACTOR_UPDATED","EMAIL_CHANGE_REQUEST"],
     template: ["TEMPLATE_CREATED","TEMPLATE_UPDATED","TEMPLATE_DELETED"],
     category: ["CATEGORY_CREATED","CATEGORY_UPDATED","CATEGORY_DELETED"],
}

export const DEFAULT_VIDEO_DIMENSION = 270;
export const STEPS = ["step1", "step2", "step3"] as const