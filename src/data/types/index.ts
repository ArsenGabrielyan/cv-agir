import { SettingsContentProps } from "@/components/settings/settings-tabs";
import { ExtendedUser } from "@/next-auth";
import { CoverLetterFormType, ResumeFormType } from "@/data/types/schema";
import { Prisma, UserPlan } from "@db";
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

// Other Types
export interface IAdminAPISearchParams<T>{
     filter: T,
     range?: [number, number],
     sort?: [keyof T, "DESC" | "ASC"]
}
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