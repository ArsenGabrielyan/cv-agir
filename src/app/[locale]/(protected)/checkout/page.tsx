import { getSubscriptionLevel } from "@/actions/subscription-system";
import { PRICING_DATA } from "@/lib/constants/landing-page";
import { redirect, routing } from "@/i18n/routing";
import { currentUser } from "@/lib/auth";
import { CheckoutPageSearchSchema } from "@/schemas";
import { UserPlan } from "@db";
import { Metadata } from "next";
import { LocalePageProps } from "@/app/[locale]/layout";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import CheckoutContent from "@/components/pages/checkout";

export const generateMetadata = async(): Promise<Metadata> => {
     const t = await getTranslations("checkout-subscription");
     return {
          title: t("title")
     }
}

export default async function CheckoutPage({searchParams, params}: LocalePageProps & {
     searchParams: Promise<{plan: UserPlan, planType: "yearly" | "monthly"}>
}){
     const {locale} = await params
     if (!hasLocale(routing.locales, locale)) {
          notFound();
     }
     const validatedFields = CheckoutPageSearchSchema.safeParse(await searchParams);
     if(!validatedFields.success){
          redirect({
               href: "/dashboard",
               locale
          })
          return;
     }
     const {plan, planType} = validatedFields.data
     const user = await currentUser();
     if(!user || !user.id){
          redirect({
               href: "/auth/login",
               locale
          })
          return;
     }
     const selectedPlan = PRICING_DATA.find(val=>val.planName===plan);
     const subscriptionLevel = await getSubscriptionLevel(user.id);
     if(!selectedPlan || subscriptionLevel==="premium"){
          redirect({
               href: "/dashboard",
               locale
          });
          return;
     }
     return (
          <CheckoutContent
               planType={planType}
               plan={plan}
               selectedPlan={selectedPlan}
          />
     )
}