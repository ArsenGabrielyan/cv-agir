import Logo from "@/components/layout/logo";
import CheckoutForm from "@/components/settings/premium/checkoutForm";
import { IPricing } from "@/lib/types";
import { UserPlan } from "@db";
import { useTranslations } from "next-intl";

interface CheckoutContentProps{
     planType: "yearly" | "monthly",
     selectedPlan: IPricing,
     plan: UserPlan
}
export default function CheckoutContent({planType, plan, selectedPlan}: CheckoutContentProps){
     const planPrice = planType==="yearly" ? selectedPlan.price*12 : selectedPlan.price;
     const t = useTranslations("checkout-subscription")
     return (
          <div className="flex justify-center items-center min-h-dvh p-3 bg-linear-to-br from-primary via-accent to-background">
               <div className="bg-card text-card-foreground p-6 shadow border rounded-xl space-y-3 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="flex items-center flex-col justify-center gap-4 text-center">
                              <Logo href="/dashboard" width={200} height={70}/>
                              <h1 className="text-lg md:text-xl font-semibold">{t("title")}</h1>
                              <p className="text-2xl md:text-3xl font-semibold">${planPrice.toFixed(2)}/{planType==="yearly" ? t("prefix.annual") : t("prefix.monthly")}</p>
                              <p className="text-muted-foreground">{t("desc")}</p>
                         </div>
                         <CheckoutForm period={planType} price={planPrice} plan={plan} aebName={t("aeb-bank")}/>
                    </div>
               </div>
          </div>
     )
}