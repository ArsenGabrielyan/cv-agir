"use client"
import { ExtendedUser } from "@/global";
import React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";

interface LandingHeroProps{
     user: ExtendedUser | undefined
}
export default function LandingHero({user}: LandingHeroProps){
     const t = useTranslations("landing-hero");
     return (
          <section className="flex justify-center items-center text-center flex-col space-y-6 py-16 px-4 w-full bg-background bg-linear-to-br from-primary to-background to-40%" id="hero">
               <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">{t("desc1")}</h1>
               <p className="text-sm md:text-xl font-light text-muted-foreground">{t("desc2")}</p>
               <Button asChild>
                    <Link href={!user ? "/auth/register" : "/dashboard"}>{t("startFree")}</Link>
               </Button>
               <p className="text-xs md:text-sm font-normal text-muted-foreground">{t("noCreditCard")}</p>
          </section>
     )
}