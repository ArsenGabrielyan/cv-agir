import { SettingsContentProps } from "@/components/settings/settings-tabs";
import { ExtendedUser } from "@/next-auth";
import { SettingsType, CoverLetterFormType, ResumeFormType } from "@/data/types/schema";
import { AuditAction, Prisma, ResumeTemplate, ResumeTemplateCategory, UserPlan } from "@db";
import { LucideProps } from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

// Themes
export type ThemeColors = "Zinc" | "Rose" | "Blue" | "Green" | "Orange";
export interface ThemeColorStateParams{
     themeColor: ThemeColors,
     setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>
}

// Pricing
export interface IPricing{
     id: number,
     name: string,
     description: string,
     price: number,
     perks: IPricingPerk[],
     highlighted: boolean,
     planName: UserPlan
}
export interface IPricingPerk{
     id: number
     name: string,
     included: boolean
}

// Other For Landing Page
export interface IFeature{
     id: number,
     name: string,
     description: string,
     Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}
export interface IQuestionFAQ{
     id: number,
     question: string,
     answer: string
}

// Links
export interface INavbarLink{
     id: number,
     name: string,
     href: string,
     isPremium?: boolean
}
interface ISidebarLinkBase {
     id: number;
     name: string;
     Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}
interface ISidebarSimpleLink extends ISidebarLinkBase {
     href: string;
     dropdown?: never;
}
interface ISidebarDropdownLink extends ISidebarLinkBase {
     href?: never;
     dropdown: INavbarLink[];
}
export type ISidebarLink = ISidebarSimpleLink | ISidebarDropdownLink;

// Admin filter types
export type QuickFilterType = "errors" | "auth" | "coverLetter" | "resume" | "subscription" | "ai" | "app" | "template" | "category"
export type AuditActionKey = `action-${QuickFilterType}`
export type IAdminAPISearchParams<T> = T extends ResumeTemplate | ResumeTemplateCategory ?{
     filter: T,
     range?: [number, number],
     sort?: [keyof T, "DESC" | "ASC"]
} : {
     filter: Record<AuditActionKey,AuditAction[]> & Partial<{
          q: string,
          fromDate: Date,
          toDate: Date,
     }>
}
export type AuditLogSearchType = Record<AuditAction, string>
export type AuditLogSearchAction = AuditAction | keyof AuditLogSearchType

// Other Types
export type ISettingsPage = {
     id: number
     name: string;
     tabName: string;
     SettingsContent: React.ComponentType<SettingsContentProps>
}

// Editor Related Types
export type PlaceholdersName = "jobName" | "degrees"
export interface UseDimensionsReturnType{
     width: number,
     height: number
}
export interface IEditorStep<Props>{
     title: string,
     component: React.ComponentType<Props>,
     key: string
}
export interface EditorFormFooterProps{
     currStep: string,
     setCurrStep: (step: string) => void
     showSmPreview: boolean,
     setShowSmPreview: (show: boolean) => void,
     onPrint: () => void
}

// Resume Related
export interface ResumeArrayFieldProps<TSchema extends FieldValues>{
     form: UseFormReturn<TSchema>,
     index: number,
     remove: (index: number) => void,
     id: string
}
export interface ResumeFormProps{
     resumeData: ResumeFormType,
     setResumeData: React.Dispatch<React.SetStateAction<ResumeFormType>>,
     userData: Omit<ExtendedUser,"currentPlan">
}
export interface CoverLetterFormProps{
     coverLetterData: CoverLetterFormType,
     setCoverLetterData: React.Dispatch<React.SetStateAction<CoverLetterFormType>>,
     userData: Omit<ExtendedUser,"currentPlan">
}
export interface IResumeDynamicFields{
     courses: {
          name: string,
          institution: string,
          startDate: string,
          endDate: string,
     },
     education: {
          degree: string,
          faculty: string,
          startDate: string,
          endDate: string,
          school: string,
          city: string,
     },
     experience: {
          job: string,
          company: string,
          startDate: string,
          endDate: string,
          city: string,
          jobInfo: string
     },
     languages: {
          name: string,
          percentage: number
     },
     links: {
          name: string,
          url: string
     },
     references: {
          fullName: string,
          position: string,
          company: string,
          phone: string,
          email: string,
     },
     skills: {
          name: string,
          percentage: number
     }
}
export const resumeDataInclude = {
     template: true
} satisfies Prisma.ResumeInclude
export type ResumeServerData = Prisma.ResumeGetPayload<{
     include: typeof resumeDataInclude
}>

// Rate limiting and Security
interface ITrackerType{
     count: number,
     expiresAt: number
}
export type TrackerType = Record<string,ITrackerType>

export interface ICaptchaResult{
     success: boolean,
     score: number,
     action: string,
     challenge_ts: string,
     hostname: string,
     "error-codes"?: string[]
}

// Audit Logging
interface ActionIPResult{ ip: string | null }
type AuthActionResult<T extends "email-optional" | "email-required" = "email-optional"> = T extends "email-optional" ? {email?: string, ip: string | null} : {email: string, ip: string | null}
type ContentActionResult<T extends "resume" | "cover-letter" | "template" | "category"> = (T extends "resume" ? {resumeId: string} : T extends "cover-letter" ? {coverLetterId: string} : T extends "template" ? {templateId: string} : T extends "category" ? {categoryId: string} : {id: string}) & ActionIPResult
type CreditCardActionResult<T extends "optional" | "required" = "required"> = T extends "optional" ? {last4?: string} & ActionIPResult : {last4: string} & ActionIPResult
export interface AuditMetadataMap{
     [AuditAction.LOGIN_ERROR]: AuthActionResult & {reason: string},
     [AuditAction.LOGIN_SUCCESS]: AuthActionResult,
     [AuditAction.PASSWORD_CHANGE_REQUEST]: {email: string}
     [AuditAction.PASSWORD_CHANGE_ERROR]: AuthActionResult & {reason: string}
     [AuditAction.PASSWORD_CHANGED]: AuthActionResult<"email-required">,
     [AuditAction.VERIFICATION_REQUEST]: {email: string},
     [AuditAction.VERIFICATION_ERROR]: AuthActionResult & {reason: string}
     [AuditAction.EMAIL_VERIFIED]: {email: string},
     [AuditAction.USER_REGISTERED]: AuthActionResult<"email-required">,
     [AuditAction.REGISTRATION_ERROR]: AuthActionResult & {reason: string},
     [AuditAction.TWO_FACTOR_VERIFIED]: AuthActionResult
     [AuditAction.LOGOUT]: AuthActionResult
     [AuditAction.OAUTH_SIGNIN]: {email: string, provider: string}
     [AuditAction.FAILED_2FA_ATTEMPT]: AuthActionResult<"email-required"> & {reason: string}
     // Content
     [AuditAction.COVER_LETTER_CREATED]: ContentActionResult<"cover-letter">,
     [AuditAction.COVER_LETTER_UPDATED]: ContentActionResult<"cover-letter">,
     [AuditAction.COVER_LETTER_DELETED]: ContentActionResult<"cover-letter">,
     [AuditAction.RESUME_CREATED]: ContentActionResult<"resume">,
     [AuditAction.RESUME_UPDATED]: ContentActionResult<"resume">,
     [AuditAction.RESUME_DELETED]: ContentActionResult<"resume">,
     [AuditAction.CV_PAGE_VIEWED]: { resumeId: string; viewerIp: string | null },
     // Subscription
     [AuditAction.CREDIT_CARD_ADDED]: CreditCardActionResult,
     [AuditAction.CREDIT_CARD_UPDATED]: CreditCardActionResult,
     [AuditAction.CREDIT_CARD_DELETED]: CreditCardActionResult<"optional">,
     [AuditAction.PLAN_UPGRADED]: ActionIPResult,
     [AuditAction.PLAN_CANCELLED]: ActionIPResult,
     [AuditAction.PLAN_RENEWED]: ActionIPResult,
     // AI
     [AuditAction.AI_ERROR]: ActionIPResult & {tool: string, input?: string, reason: string},
     [AuditAction.AI_SUMMARY_GENERATED]: ActionIPResult
     [AuditAction.AI_EXPERIENCE_GENERATED]: ActionIPResult
     [AuditAction.AI_COVER_LETTER_GENERATED]: ActionIPResult
     // Contact Form
     [AuditAction.CONTACT_FORM_SUBMISSION_ERROR]: ActionIPResult & {reason: string},
     [AuditAction.CONTACT_FORM_SUBMITTED]: ActionIPResult & { messageLength: number}
     [AuditAction.INVALID_CAPTCHA]: ActionIPResult & {score: number, reasons?: string[]}
     // Settings
     [AuditAction.ACCOUNT_UPDATED]: ActionIPResult & {changedFields: (keyof SettingsType)[]}
     [AuditAction.TWO_FACTOR_UPDATED]: ActionIPResult & {enabled: boolean};
     [AuditAction.EMAIL_CHANGE_REQUEST]: ActionIPResult & {newEmail: string}
     // Admin
     [AuditAction.TEMPLATE_CREATED]: ContentActionResult<"template">,
     [AuditAction.TEMPLATE_UPDATED]: ContentActionResult<"template">,
     [AuditAction.TEMPLATE_DELETED]: ContentActionResult<"template">,
     [AuditAction.CATEGORY_CREATED]: ContentActionResult<"category">,
     [AuditAction.CATEGORY_UPDATED]: ContentActionResult<"category">,
     [AuditAction.CATEGORY_DELETED]: ContentActionResult<"category">,
     // Forms
     [AuditAction.VALIDATION_ERROR]: {fields: (string | number)[]},
     [AuditAction.RATE_LIMIT_EXCEEDED]: ActionIPResult & {route: string}
     [AuditAction.ACTION_ERROR]: ActionIPResult & {reason: string},
     [AuditAction.NO_ADMIN_ACCESS]: ActionIPResult & {route?: string, method: string}
     [AuditAction.UNAUTHORIZED]: ActionIPResult & {route?: string}
}
export type AuditMetadata<A extends AuditAction> = A extends keyof AuditMetadataMap ? AuditMetadataMap[A] : undefined
export const auditLogsInclude = {
     user: true
} satisfies Prisma.AuditLogInclude
export type AuditLogServerData = Prisma.AuditLogGetPayload<{
     include: {
          user: boolean | undefined
     }
}>