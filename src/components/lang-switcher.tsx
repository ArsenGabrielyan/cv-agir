"use client"
import { 
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue
} from "@/components/ui/select";
import { CircleFlag } from 'react-circle-flags'
import { usePathname, useRouter } from "@/i18n/routing"
import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { languages } from "@/i18n/config";
import { LangCodeType } from "@/i18n/types";

interface LangSwitcherSelectProps{
     children: React.ReactNode,
     defaultValue: LangCodeType,
     label: string
}
function LangSwitcherSelect({children,defaultValue,label}: LangSwitcherSelectProps){
     const router = useRouter();
     const [isPending, startTransition] = useTransition();
     const pathname = usePathname();
     const onValueChange = (value: LangCodeType) => startTransition(()=>router.replace(
          {pathname},
          {locale: value}
     ))
     return (
          <Select defaultValue={defaultValue} disabled={isPending} onValueChange={onValueChange}>
               <SelectTrigger className="!font-sans bg-background/20">
                    <SelectValue placeholder={label} />
               </SelectTrigger>
               <SelectContent className="!font-sans">
                    {children}
               </SelectContent>
          </Select>
     )
}

export default function LanguageSwitcher(){
     const t = useTranslations("index");
     const locale = useLocale();
     return (
          <LangSwitcherSelect defaultValue={locale} label={t("langSwitcherLabel")}>
               {languages.map(lang=>(
                    <SelectItem value={lang.code} key={lang.code} className="gap-3">
                         <CircleFlag countryCode={lang.countryCode} className="size-4"/>
                         {lang.label}
                    </SelectItem>
               ))}
          </LangSwitcherSelect>
     )
}