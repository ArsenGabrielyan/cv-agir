import { IFeature, IPricing } from "../../lib/types";
import { BrainCog, Edit, Palette, QrCode } from "lucide-react";
import { Features } from "../../lib/types/enums";

export const PRICING_DATA: IPricing[] = [
     {
          id: 1,
          planName: "free",
          price: 0,
          highlighted: false,
          perks: [
               {name: "free.perks.perk-1", included: true},
               {name: "free.perks.perk-2", included: true},
               {name: "free.perks.perk-3", included: true},
               {name: "other-perks.perk-1", included: false},
               {name: "other-perks.perk-2", included: false},
               {name: "other-perks.perk-3", included: false}
          ]
     },
     {
          id: 2,
          planName: "premium",
          highlighted: true,
          price: 14.99,
          perks: [
               {name: "premium.perks.perk-1", included: true},
               {name: "premium.perks.perk-2", included: true},
               {name: "premium.perks.perk-3", included: true},
               {name: "other-perks.perk-1", included: true},
               {name: "other-perks.perk-2", included: true},
               {name: "other-perks.perk-3", included: true}
          ]
     },
]
export const FEATURES: IFeature[] = [
     {
          feature: Features.AiSuggestions,
          Icon: BrainCog
     },
     {
          feature: Features.EasyEdit,
          Icon: Edit
     },
     {
          feature: Features.QrResume,
          Icon: QrCode
     },
     {
          feature: Features.Design,
          Icon: Palette
     }
]