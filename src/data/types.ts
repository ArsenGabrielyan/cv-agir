import { ResumeFormType } from "@/schemas/types";
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
     href: string
}
export interface ISidebarLink extends INavbarLink{
     Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
     dropdown?: INavbarLink[]
}

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
     component: React.JSX.Element;
}
export type PlaceholdersName = "jobName" | "degrees"
export interface UseDimensionsReturnType{
     width: number,
     height: number
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
     setResumeData: React.Dispatch<React.SetStateAction<ResumeFormType>>
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