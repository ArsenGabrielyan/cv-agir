import { AuditAction, Prisma } from "@db";
import { AuditLogServerData, AuditMetadata } from "../types";
import { AUDIT_QUICK_FILTERS, SEARCH_KEYWORDS } from "../constants";

export function maskEmail(email: string): string {
     const [local, domain] = email.split("@");
     if (!local || !domain) return email;
   
     const visiblePart = local[0];
     const maskedPart = "*".repeat(Math.max(local.length - 1, 1));
     
     return `${visiblePart}${maskedPart}@${domain}`;
}
export const maskText = (text: string, length = 100) => text.length > length ? text.slice(0,length)+"..." : text;
function isValidMetadata<A extends AuditAction>(metadata: Prisma.JsonValue): metadata is Extract<AuditMetadata<A>,object> {
     return typeof metadata === "object" && metadata !== null
}
export const getActionsByFuzzyText = (input: string): AuditAction[] => Object.entries(SEARCH_KEYWORDS)
     .filter(([, desc]) => desc.toLowerCase().includes(input.toLowerCase()))
     .map(([key]) => key as AuditAction);
export function formatAuditLogData(record: AuditLogServerData){
     const {user, action, metadata} = record;
     const actionText = (text:string, prefix = "ը") => `${user ? `«${user.name}»-${prefix}` : `Անհայտ օգտագործող${prefix}`} ${text.toLowerCase()}`.trim();
     let primaryText = "";
     let secondaryText = "";
     switch(action){
          case "ACCOUNT_UPDATED": {
               primaryText = actionText("կարգավորումները թարմացված են։","ի")
               if (isValidMetadata<"ACCOUNT_UPDATED">(metadata)) {
                    secondaryText = `IP՝ ${metadata.ip}, Փոփոխված դաշտեր՝ ${metadata.changedFields.join(", ")}։`;
               }
               break;
          }
          case 'ACTION_ERROR': {
               primaryText = actionText("գործողություն իրականացնելու ընթացքում սխալ առաջացավ։")
               if(isValidMetadata<"ACTION_ERROR">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Պատճառ՝ ${metadata.reason}`
               }
               break;
          }
          case "AI_COVER_LETTER_GENERATED":{
               primaryText = actionText("Արհեստական Բանականության միջոցով գեներացրել է ուղեկցող նամակ։")
               if(isValidMetadata<"AI_COVER_LETTER_GENERATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}`
               }
               break;
          }
          case "AI_ERROR":{
               primaryText = actionText("Արհեստական Բանականության միջոցով գեներացրելու ընթացքում սխալ առաջացավ։")
               if(isValidMetadata<"AI_ERROR">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Գործողություն՝ ${metadata.tool.toLowerCase()}, Պատճառ՝ ${metadata.reason}`
               }
               break;
          }
          case "AI_EXPERIENCE_GENERATED":{
               primaryText = actionText("Արհեստական Բանականության միջոցով գեներացրել է աշխատանքային փորձ։")
               if(isValidMetadata<"AI_EXPERIENCE_GENERATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}`
               }
               break;
          }
          case "AI_SUMMARY_GENERATED":{
               primaryText = actionText("Արհեստական Բանականության միջոցով գեներացրել է նկարագրություն։")
               if(isValidMetadata<"AI_SUMMARY_GENERATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}`
               }
               break;
          }
          case "CATEGORY_CREATED":{
               primaryText = actionText("ավելացրել է նոր կատեգորիա։")
               if(isValidMetadata<"CATEGORY_CREATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Կատեգորիա #${metadata.categoryId}`
               }
               break;
          }
          case "CATEGORY_DELETED":{
               primaryText = actionText("ջնջել է նշված կատեգորիան։")
               if(isValidMetadata<"CATEGORY_DELETED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Կատեգորիա #${metadata.categoryId}`
               }
               break;
          }
          case "CATEGORY_UPDATED":{
               primaryText = actionText("թարմացրել է նշված կատեգորիան։")
               if(isValidMetadata<"CATEGORY_UPDATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Կատեգորիա #${metadata.categoryId}`
               }
               break;
          }
          case "CONTACT_FORM_SUBMISSION_ERROR":{
               primaryText = actionText("հաղորդագրություն ուղարկելու ընթացքում սխալ առաջացավ։")
               if(isValidMetadata<"CONTACT_FORM_SUBMISSION_ERROR">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Պատճառ՝ ${metadata.reason}`
               }
               break;
          }
          case "CONTACT_FORM_SUBMITTED":{
               primaryText = actionText("ուղարկել է հաղորդագրություն։")
               if(isValidMetadata<"CONTACT_FORM_SUBMITTED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Հաղորդագրությունը ունի ${metadata.messageLength} նիշ։`
               }
               break;
          }
          case "COVER_LETTER_CREATED":{
               primaryText = actionText("գրել է նոր ուղեկցող նամակ։")
               if(isValidMetadata<"COVER_LETTER_CREATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Ուղեկցող նամակ ${metadata.coverLetterId}`
               }
               break;
          }
          case "COVER_LETTER_DELETED":{
               primaryText = actionText("ջնջել է նշված ուղեկցող նամակը։")
               if(isValidMetadata<"COVER_LETTER_DELETED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Ուղեկցող նամակ ${metadata.coverLetterId}`
               }
               break;
          }
          case "COVER_LETTER_UPDATED":{
               primaryText = actionText("թարմացրել է նշված ուղեկցող նամակը։")
               if(isValidMetadata<"COVER_LETTER_UPDATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Ուղեկցող նամակ ${metadata.coverLetterId}`
               }
               break;
          }
          case "CREDIT_CARD_ADDED":{
               primaryText = actionText("ավելացրել է նոր վարկային քարտ։")
               if(isValidMetadata<"CREDIT_CARD_ADDED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Վարկային քարտի համար՝ **** **** **** ${metadata.last4}`
               }
               break;
          }
          case "CREDIT_CARD_DELETED":{
               primaryText = actionText("հեռացրել է վարկային քարտի տվյալները։")
               if(isValidMetadata<"CREDIT_CARD_DELETED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Վարկային քարտի համար՝ **** **** **** ${metadata.last4}`
               }
               break;
          }
          case "CREDIT_CARD_UPDATED":{
               primaryText = actionText("փոխել է վարկային քարտի տվյալները։")
               if(isValidMetadata<"CREDIT_CARD_UPDATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Վարկային քարտի համար՝ **** **** **** ${metadata.last4}`
               }
               break;
          }
          case "CV_PAGE_VIEWED":{
               primaryText = actionText("դիտել է ռեզյումեի ընդհանուր ինֆորմացիան։")
               if(isValidMetadata<"CV_PAGE_VIEWED">(metadata)){
                    secondaryText = `IP՝ ${metadata.viewerIp}, Ռեզյումե #${metadata.resumeId}`
               }
               break;
          }
          case "EMAIL_CHANGE_REQUEST":{
               primaryText = actionText("ուզում է փոխել իր էլ․ հասցեն։")
               if(isValidMetadata<"EMAIL_CHANGE_REQUEST">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Նոր էլ․ հասցե՝ ${metadata.newEmail}`
               }
               break;
          }
          case "EMAIL_VERIFIED":{
               primaryText = actionText("հաստատել է իր էլ․ հասցեն։")
               if(isValidMetadata<"EMAIL_VERIFIED">(metadata)){
                    secondaryText = `էլ․ հասցե՝ ${metadata.email}`
               }
               break;
          }
          case "FAILED_2FA_ATTEMPT":{
               primaryText = actionText("երկաստիճան վավերացումը չստացվեց։","ի")
               if(isValidMetadata<"FAILED_2FA_ATTEMPT">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, էլ․ հասցե՝ ${metadata.email}, Պատճառ՝ ${metadata.reason}`
               }
               break;
          }
          case "INVALID_CAPTCHA":{
               primaryText = actionText("captcha ստուգումը չստացվեց։","ի")
               if(isValidMetadata<"INVALID_CAPTCHA">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Պատճառներ՝ ${metadata.reasons?.join(", ")}`
               }
               break;
          }
          case "LOGIN_ERROR":{
               primaryText = actionText("մուտք գործման ընթացքում սխալ առաջացավ։")
               if(isValidMetadata<"LOGIN_ERROR">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, էլ․ հասցե՝ ${metadata.email}, Պատճառ՝ ${metadata.reason}`
               }
               break
          }
          case "LOGIN_SUCCESS":{
               primaryText = actionText("մուտք գործեց այս հավելվածին։")
               if(isValidMetadata<"LOGIN_SUCCESS">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, էլ․ հասցե՝ ${metadata.email}`
               }
               break
          }
          case "LOGOUT":{
               primaryText = actionText("դուրս եկավ այս հավելվածից։")
               if(isValidMetadata<"LOGOUT">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, էլ․ հասցե՝ ${metadata.email}`
               }
               break
          }
          case "NO_ADMIN_ACCESS":{
               primaryText = actionText("փորձել է օգտագործել ադմինիստրատորի գործողությունները առանց թույլտվության։")
               if(isValidMetadata<"NO_ADMIN_ACCESS">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Գործողության վայր՝ ${metadata.route}, Մեթոդ՝ ${metadata.route}`
               }
               break
          }
          case "OAUTH_SIGNIN":{
               primaryText = actionText("մուտք գործեց այս հավելվածին ուրիշ մեթոդով։")
               if(isValidMetadata<"OAUTH_SIGNIN">(metadata)){
                    secondaryText = `Էլ․ հասցե՝ ${metadata.email}, Մեթոդ՝ ${metadata.provider}`
               }
               break
          }
          case "PASSWORD_CHANGED":{
               primaryText = actionText("փոխել է իր գաղտնաբառը նոր գաղտնաբառով։")
               if(isValidMetadata<"PASSWORD_CHANGED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Էլ․ հասցե՝ ${metadata.email}`
               }
               break
          }
          case "PASSWORD_CHANGE_ERROR":{
               primaryText = actionText("գաղտնաբառը փոխելու ընթացքում (գաղտնաբառը փոխելուց առաջ) սխալ առաջացավ։","ի")
               if(isValidMetadata<"PASSWORD_CHANGE_ERROR">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Էլ․ հասցե՝ ${metadata.email}, Պատճառ՝ ${metadata.reason}`
               }
               break
          }
          case "PASSWORD_CHANGE_REQUEST":{
               primaryText = actionText("ուզում է փոխել իր գաղտնաբառը։")
               if(isValidMetadata<"PASSWORD_CHANGE_REQUEST">(metadata)){
                    secondaryText = `Էլ․ հասցե՝ ${metadata.email}`
               }
               break
          }
          case "PLAN_CANCELLED":{
               primaryText = actionText("անցել է անվճար տարբերակի։")
               if(isValidMetadata<"PLAN_CANCELLED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}`
               }
               break
          }
          case "PLAN_RENEWED":{
               primaryText = actionText("վերանայել է պրեմիում տարբերակը։")
               if(isValidMetadata<"PLAN_RENEWED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}`
               }
               break
          }
          case "PLAN_UPGRADED":{
               primaryText = actionText("անցել է պրեմիում տարբերակի։")
               if(isValidMetadata<"PLAN_UPGRADED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}`
               }
               break
          }
          case "RATE_LIMIT_EXCEEDED":{
               primaryText = actionText("շատ հաճախ է փորձում իրականացնել այս գործողություն։")
               if(isValidMetadata<"RATE_LIMIT_EXCEEDED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Գործողություն՝ ${metadata.route}`
               }
               break
          }
          case "REGISTRATION_ERROR":{
               primaryText = actionText("գրանցվելու ընթացքում առաջացել է սխալ։")
               if(isValidMetadata<"REGISTRATION_ERROR">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Էլ․ հասցե՝ ${metadata.email}, Պատճառ՝ ${metadata.reason}`
               }
               break
          }
          case "RESUME_CREATED":{
               primaryText = actionText("ստեղծել է նոր ռեզյումե։")
               if(isValidMetadata<"RESUME_CREATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Ռեզյումե #${metadata.resumeId}`
               }
               break
          }
          case "RESUME_DELETED":{
               primaryText = actionText("ջնջել է նշված ռեզյումեն։")
               if(isValidMetadata<"RESUME_DELETED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Ռեզյումե #${metadata.resumeId}`
               }
               break
          }
          case "RESUME_UPDATED":{
               primaryText = actionText("թարմացրել է նշված ռեզյումեն։")
               if(isValidMetadata<"RESUME_UPDATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Ռեզյումե #${metadata.resumeId}`
               }
               break
          }
          case "TEMPLATE_CREATED":{
               primaryText = actionText("ավելացրել է նոր ռեզյումեի շաբլոն։")
               if(isValidMetadata<"TEMPLATE_CREATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Շաբլոն #${metadata.templateId}`
               }
               break
          }
          case "TEMPLATE_DELETED":{
               primaryText = actionText("ջնջել է նշված ռեզյումեի շաբլոնը։")
               if(isValidMetadata<"TEMPLATE_DELETED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Շաբլոն #${metadata.templateId}`
               }
               break
          }
          case "TEMPLATE_UPDATED":{
               primaryText = actionText("թարմացել է նշված ռեզյումեի շաբլոնը։")
               if(isValidMetadata<"TEMPLATE_UPDATED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Շաբլոն #${metadata.templateId}`
               }
               break
          }
          case "TWO_FACTOR_UPDATED":{
               if(isValidMetadata<"TWO_FACTOR_UPDATED">(metadata)){
                    primaryText = actionText(`${metadata.enabled ? "միացրել է" : 'անջատել է'} երկաստիճան վավերացումը հաջորդ անգամ մուտք գործելիս։`)
                    secondaryText = `IP՝ ${metadata.ip}`
               }
               break
          }
          case "TWO_FACTOR_VERIFIED":{
               primaryText = actionText("երկաստիճան վավերացումը ստացվել է։","ի")
               if(isValidMetadata<"TWO_FACTOR_VERIFIED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, էլ․ հասցե՝ ${metadata.email}`
               }
               break
          }
          case "UNAUTHORIZED":{
               primaryText = actionText("փորձել է իրականացնել գործողությունը առանց մուտք գործման")
               if(isValidMetadata<"UNAUTHORIZED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, էջ, որտեղ առաջացել է սխալը՝ ${metadata.route}`
               }
               break
          }
          case "USER_REGISTERED":{
               primaryText = actionText("գրանցվել է այս հավելվածը")
               if(isValidMetadata<"USER_REGISTERED">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Էլ․ հասցե՝ ${metadata.email}`
               }
               break
          }
          case "VALIDATION_ERROR":{
               primaryText = actionText("փորձել է իրականացնել գործողությունը առանց վավերացնելու։")
               if(isValidMetadata<"VALIDATION_ERROR">(metadata)){
                    secondaryText = `Դաշտեր, որոնք վավեր չեն՝ ${metadata.fields.join(", ")}`
               }
               break
          }
          case "VERIFICATION_ERROR":{
               primaryText = actionText("էլ․ հասցեն հաստատման ընթացքում առաջացել է սխալ։","ի")
               if(isValidMetadata<"VERIFICATION_ERROR">(metadata)){
                    secondaryText = `IP՝ ${metadata.ip}, Էլ․ հասցե՝ ${metadata.email}, Պատճառ՝ ${metadata.reason}`
               }
               break
          }
          case "VERIFICATION_REQUEST":{
               primaryText = actionText("Ուզում է հաստատել իր էլ․ հասցեն")
               if(isValidMetadata<"VERIFICATION_REQUEST">(metadata)){
                    secondaryText = `Էլ․ հասցե՝ ${metadata.email}`
               }
               break
          }
          default: {
               primaryText = actionText(`իրականացրել է «${action}» գործողությունը։`);
          }
     }
     return {
          primaryText,
          secondaryText,
          isError: AUDIT_QUICK_FILTERS.errors.includes(action)
     }
}