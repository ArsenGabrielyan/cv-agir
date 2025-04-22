import {createEnv} from "@t3-oss/env-nextjs"
import * as z from "zod";

export const env = createEnv({
     server: {
          DATABASE_URL: z.string().min(1,"Տվյալների բազայի հղումը պարտադիր է։"),
          AUTH_SECRET: z.string().min(1,"Next Auth-ի բանալին (secret key) պարտադիր է։"),
          AUTH_URL: z.string().min(1,"Next Auth-ի URL-ը պարտադիր է։").url("Next Auth-ի URL-ը պետք է լինի վավերական URL։"),
          BLOB_READ_WRITE_TOKEN: z.string().min(1,"Հավելվածի հիշողության բանալին (token) պարտադիր է։"),
          GITHUB_ID: z.string().min(1,"GitHub-ի client ID-ն (secret key) պարտադիր է։"),
          GITHUB_SECRET: z.string().min(1,"GitHub-ի client secret key-ը պարտադիր է։"),
          GOOGLE_ID: z.string().min(1,"Google-ի client ID-ն պարտադիր է։"),
          GOOGLE_SECRET: z.string().min(1,"Google-ի client secret key-ը պարտադիր է։"),
          GEMINI_API_KEY: z.string().min(1,"Google Gemini-ի բանալին (api key) պարտադիր է"),
          FACEBOOK_ID: z.string().min(1,"Facebook-ի client ID-ն պարտադիր է։"),
          FACEBOOK_SECRET: z.string().min(1,"Facebook-ի client secret key-ը պարտադիր է։"),
          RESEND_API_KEY: z.string().min(1,"Resend-ի բանալին (api key) պարտադիր է"),
          DEV_EMAIL: z.string().min(1,"Խնդրում ենք ավելացնել այս հավելվածի ծրագրավորողի էլ․ հասցեն։").email("Մուտքագրեք վավերական էլ․ հասցե"),
          ONBOARDING_EMAIL: z.string().min(1,"Խնդրում ենք ավելացնել էլ․ փոստ ուղարկելու էլ․ հասցեն (այդպես անել, որ այս էլ․ հասցեն Resend-ով աշխատի)։").email("Մուտքագրեք վավերական էլ․ հասցե"),
          AES_SECRET: z.string().min(1,"Գաղտնագրման բանալին (secret key) պարտադիր է։"),
          RECAPTCHA_SECRET: z.string().min(1,"ReCaptcha-ի աշխատող բանալին (secret key) պարտադիր է։")
     },
     client: {
          NEXT_PUBLIC_APP_URL: z.string().min(1,"Հիմնական հավելվածի URL-ը պարտադիր է։").url("Հիմնական հավելվածի URL-ը պետք է լինի վավերական URL։"),
          NEXT_PUBLIC_RECAPTCHA_SITE: z.string().min(1,"ReCaptcha-ի կայքի բանալին (site key) պարտադիր է։"),
     },
     experimental__runtimeEnv: {
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
          NEXT_PUBLIC_RECAPTCHA_SITE: process.env.NEXT_PUBLIC_RECAPTCHA_SITE
     },
     emptyStringAsUndefined: true,
})