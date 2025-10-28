import { MAX_RESUME_MAP } from "@/lib/constants";
import { UserPlan } from "@db";
import { useTranslations } from "next-intl";

export const getAvailableFeatures = (level: UserPlan, t: ReturnType<typeof useTranslations<"error-messages">>) => {
     const isValidPlan = level in MAX_RESUME_MAP;
     if(!isValidPlan){
          throw new Error(t("subscription.no-plan",{level}))
     }
     const isPremium = level==="premium"
     return {
          canUseAITools: isPremium,
          canUseTemplates: isPremium,
          canUseCustomization: isPremium,
          canCreateResume: (currResumeCount: number) => currResumeCount < MAX_RESUME_MAP[level],
          canCreateCoverLetters: isPremium,
     }
}