import { AuditAction, UserPlan } from "@db"
import { AuditLogSearchType, IResumeDynamicFields, PlaceholdersName, QuickFilterType } from "../types"

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

export const AI_MODEL = "gemini-1.5-flash-8b"

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
export const ERROR_MESSAGES = {
     validationError: "Բոլոր դաշտերը վավեր չեն։",
     rateLimitError: "Շատ հաճախ եք փորձում։ Խնդրում ենք փորձել ավելի ուշ։",
     unknownError: "Վայ, մի բան սխալ տեղի ունեցավ։ Խնդրում ենք նորից փորձել",
     settingsError: "Չհաջողվեց թարմացնել կարգավորումները։",
     auth: {
          noUserFound: "Այս էլ․ հասցեն գրանցված չէ։",
          wrong2FAcode: "Վավերացման կոդը սխալ է։",
          expired2FAcode: "Վավերացման կոդի ժամկետը անցել է։",
          noPassResetToken: "Բացակայում է վերականգման token-ը։",
          wrongPassResetToken: "Վերականգման token-ը գոյություն չունի կամ սխալ է։",
          expiredPassResetToken: "Վերականգման token-ի ժամկետը անցել է։",
          wrongNewPassword: "Նոր գաղտնաբառը չի կարող համընկնել հին գաղտնաբառի հետ։",
          noVerificationToken: "Հաստատման token-ը գոյություն չունի կամ սխալ է։",
          missingVerificationToken: "Բացակայում է հաստատման token-ը",
          expiredVerificationToken: "Հաստատման token-ի ժամկետը անցել է։",
          takenEmail: "Էլ․ հասցեն արդեն օգտագործված է։",
          invalidEmail: "Էլ․ հասցեն վավեր չէ։",
          wrongPassword: 'Գաղտնաբառը սխալ է։',
          notVerified: "Այս էլ․ հասցեն հաստատված չէ",
          failed2FA: "Երկաստիճան վավերացումը չստացվեց",
          unauthorized: "Դուք նույնականացված չեք։ Խնդրում ենք մուտք գործել հաշվին։",
          notSubscribed: "Դուք բաժանորդագրված չեք։ Խնդրում ենք բաժանորդագրվել մեր պրեմիում տարբերակին։",
          noAdminAccess: "Այս հաշիվը մուտք գործված չէ կամ ադմինիստրատորի իրավունքները չունի։",
     },
     ai: {
          answerError: "Չհաջողվեց գեներացնել պատասխանը Արհեստական Բանականության կողմից։",
          invalidExperienceInput: "Աշխատանքային փորձի նկարագրությունը վավեր չէ։"
     },
     subscription: {
          expiredCreditCard: "Քարտի ժամկետը պարտադիր է։",
          noCreditCard: "Այսպիսի քարտ գոյություն չունի։",
          invalidExpiryDate: "Ժամկետի ֆորմատը սխալ է։ Պետք է լինի MM/YY ֆորմատով։",
          cantUseFeatures: "Այս հմտությունը օգտագործելու համար անցեք պրեմիում տարբերակի։",
          noAccessToCoverLetter: "Անվճար բաժանորդագրության համար ուղեկցող նամակի հետ աշխատելը արգելված է։",
          noCustomization: "Ամբողջական դիզայնի ձևափոխությունը այս բաժանորդագրությունում արգելված է",
          limitedResumeCount: "Անվճար բաժանորդագրության համար առավելագույն ռեզյումեների քանակը սպառվել է",
          invalidPlan: "Այսպիսի տարբերակ գոյություն չունի։"
     },
     contactForm: {
          noCaptchaToken: "Token-ը չի գտնվել։",
          failedCaptcha: "Կասկածելի ակտիվություն։ Captcha-ի ստուգումը չստացվեց։",
     },
     encryption: {
          invalidForEncryption: "Մուտքագրեք վավերական տեքստ գաղտնագրելու համար։",
          invalidForDecryption: "Մուտքագրեք վավերական տեքստ վերծանելու համար։",
          missingParts: "Տեքստը վերծանելու համար ինչ-որ մաս բացակայում է։"
     },
     content: {
          noCoverLetter: "Ուղեկցող նամակը չի գտնվել",
          noResume: "Ռեզյումեն չի գտնվել",
          failedImageDelete: "Չհաջողվեց ջնջել նկարը",
          resumeSaveError: "Չհաջողվեց պահպանել ռեզյումեն",
          coverLetterSaveError: "Չհաջողվեց պահպանել նամակը",
          noCategory: "Այս կատեգորիան գոյություն չունի",
          noTemplate: "Այս շաբլոնը գոյություն չունի"
     }
}

export const SEARCH_KEYWORDS: AuditLogSearchType= {
     // Auth
     LOGIN_ERROR: "մուտք գործման ընթացքում սխալ առաջացավ։",
     LOGIN_SUCCESS: "մուտք գործեց այս հավելվածին։",
     PASSWORD_CHANGE_REQUEST: "ուզում է փոխել իր գաղտնաբառը։",
     PASSWORD_CHANGE_ERROR: "գաղտնաբառը փոխելու ընթացքում (գաղտնաբառը փոխելուց առաջ) սխալ առաջացավ։",
     PASSWORD_CHANGED: "փոխել է իր գաղտնաբառը նոր գաղտնաբառով։",
     VERIFICATION_REQUEST: "Ուզում է հաստատել իր էլ․ հասցեն",
     VERIFICATION_ERROR: "էլ․ հասցեն հաստատման ընթացքում առաջացել է սխալ։",
     EMAIL_VERIFIED: "հաստատել է իր էլ․ հասցեն։",
     USER_REGISTERED: "գրանցվել է այս հավելվածը",
     REGISTRATION_ERROR: "գրանցվելու ընթացքում առաջացել է սխալ։",
     TWO_FACTOR_VERIFIED: "երկաստիճան վավերացումը ստացվել է։",
     LOGOUT: "դուրս եկավ այս հավելվածից։",
     OAUTH_SIGNIN: "մուտք գործեց այս հավելվածին ուրիշ մեթոդով։",
     FAILED_2FA_ATTEMPT: "երկաստիճան վավերացումը չստացվեց։",
   
     // Content
     COVER_LETTER_DELETED: "ջնջել է նշված ուղեկցող նամակը։",
     COVER_LETTER_CREATED: "գրել է նոր ուղեկցող նամակ։",
     COVER_LETTER_UPDATED: "թարմացրել է նշված ուղեկցող նամակը։",
     RESUME_DELETED: "ջնջել է նշված ռեզյումեն։",
     RESUME_CREATED: "ստեղծել է նոր ռեզյումե։",
     RESUME_UPDATED: "թարմացրել է նշված ռեզյումեն։",
     CV_PAGE_VIEWED: "դիտել է ռեզյումեի ընդհանուր ինֆորմացիան։",
   
     // Subscription
     CREDIT_CARD_ADDED: "ավելացրել է նոր վարկային քարտ։",
     CREDIT_CARD_UPDATED: "փոխել է վարկային քարտի տվյալները։",
     CREDIT_CARD_DELETED: "հեռացրել է վարկային քարտի տվյալները։",
     PLAN_UPGRADED: "անցել է պրեմիում տարբերակի։",
     PLAN_CANCELLED: "անցել է անվճար տարբերակի։",
     PLAN_RENEWED: "վերանայել է պրեմիում տարբերակը։",
   
     // AI
     AI_ERROR: "Արհեստական Բանականության միջոցով գեներացրելու ընթացքում սխալ առաջացավ։",
     AI_SUMMARY_GENERATED: "Արհեստական Բանականության միջոցով գեներացրել է նկարագրություն։",
     AI_EXPERIENCE_GENERATED: "Արհեստական Բանականության միջոցով գեներացրել է աշխատանքային փորձ։",
     AI_COVER_LETTER_GENERATED: "Արհեստական Բանականության միջոցով գեներացրել է ուղեկցող նամակ։",
   
     // Contact Form
     CONTACT_FORM_SUBMISSION_ERROR: "հաղորդագրություն ուղարկելու ընթացքում սխալ առաջացավ։",
     INVALID_CAPTCHA: "captcha ստուգումը չստացվեց։",
     CONTACT_FORM_SUBMITTED: "ուղարկել է հաղորդագրություն։",
   
     // Settings
     ACCOUNT_UPDATED: "կարգավորումները թարմացված են։",
     TWO_FACTOR_UPDATED: "երկաստիճան վավերացումը հաջորդ անգամ մուտք գործելիս։",
     EMAIL_CHANGE_REQUEST: "ուզում է փոխել իր էլ․ հասցեն։",
   
     // Admin
     TEMPLATE_CREATED: "ավելացրել է նոր ռեզյումեի շաբլոն։",
     TEMPLATE_UPDATED: "թարմացել է նշված ռեզյումեի շաբլոնը։",
     TEMPLATE_DELETED: "ջնջել է նշված ռեզյումեի շաբլոնը։",
     CATEGORY_CREATED: "ավելացրել է նոր կատեգորիա։",
     CATEGORY_UPDATED: "թարմացրել է նշված կատեգորիան։",
     CATEGORY_DELETED: "ջնջել է նշված կատեգորիան։",
   
     // Forms
     VALIDATION_ERROR: "փորձել է իրականացնել գործողությունը առանց վավերացնելու։",
     RATE_LIMIT_EXCEEDED: "շատ հաճախ է փորձում իրականացնել այս գործողություն։",
     ACTION_ERROR: "գործողություն իրականացնելու ընթացքում սխալ առաջացավ։",
     UNAUTHORIZED: "փորձել է իրականացնել գործողությունը առանց մուտք գործման",
     NO_ADMIN_ACCESS: "փորձել է օգտագործել ադմինիստրատորի գործողությունները առանց թույլտվության։"
}
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
export const AUDIT_FILTER_LABELS: Record<QuickFilterType, string> = {
     errors: "Սխալներ",
     auth: "Նույնականացում",
     coverLetter: "Ուղեկցող նամակներ",
     resume: "Ռեզյումեներ",
     subscription: "Բաժանորդագրություն",
     ai: "Արհեստական բանականություն",
     app: "Հավելվածի գործողություններ",
     template: "Շաբլոններ",
     category: "Կատեգորիաներ",
};