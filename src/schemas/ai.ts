import * as z from "zod";
import { optionalString } from "./resume";
import { ResumeDetailsSchema } from ".";

export const GenerateSummarySchema = z.object({
     jobTitle: optionalString,
     ...ResumeDetailsSchema.shape
})

export const GenerateDescriptionSchema = z.object({
     description: z.string().trim().min(1,"Պարտադիր է").min(20,"Մինիմում 20 նիշ")
})