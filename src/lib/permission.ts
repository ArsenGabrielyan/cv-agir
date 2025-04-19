import { MAX_RESUME_MAP } from "@/data/constants/other";
import { UserPlan } from "@db";

export const getAvailableFeatures = (level: UserPlan) => {
     const isValidPlan = level in MAX_RESUME_MAP;
     if(!isValidPlan){
          throw new Error(`Այսպիսի տարբերակ (${level}) գոյություն չունի`)
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