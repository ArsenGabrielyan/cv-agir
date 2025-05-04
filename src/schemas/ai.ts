import * as z from "zod";
import { optionalJobTitleString, optionalString } from "./fields";
import { CoverLetterDetailsSchema, ResumeDetailsSchema } from ".";

export const GenerateSummarySchema = z.object({
     jobTitle: optionalJobTitleString,
     ...ResumeDetailsSchema.shape
})

export const GenerateDescriptionSchema = z.object({
     description: z.string().trim().min(20,"Մինիմում 20 նիշ").max(400,"400 նիշից ավել է").trim()
})

export const GenerateLetterBodySchema = z.object({
     jobTitle: optionalJobTitleString,
     fname: optionalString,
     lname: optionalString,
     ...CoverLetterDetailsSchema.shape
})