"use client"
import { CircleFlag } from 'react-circle-flags'
import { usePathname, useRouter } from "@/i18n/routing"
import { useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { languages } from "@/i18n/config";
import { LangCodeType } from "@/i18n/types";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface LangSwitcherSelectProps{
     children: React.ReactNode,
     defaultValue: LangCodeType,
     label: string,
     open: boolean,
     onOpenChange: (val: boolean) => void,
     disabled: boolean
}
function LangSwitcherSelect({children,defaultValue, open, onOpenChange, disabled}: LangSwitcherSelectProps){
     const lang = useMemo(()=>languages.find(val=>val.code===defaultValue),[defaultValue])
     return (
          <DropdownMenu open={open} onOpenChange={onOpenChange}>
               {lang && (
                    <DropdownMenuTrigger disabled={disabled} className={cn("!font-sans select-none",disabled && "pointer-events-none opacity-50")}>
                         <CircleFlag countryCode={lang.countryCode} className="size-4" title={lang.label}/>
                    </DropdownMenuTrigger>
               )}
               <DropdownMenuContent className="!font-sans">
                    {children}
               </DropdownMenuContent>
          </DropdownMenu>
     )
}

export default function LanguageSwitcher(){
     const t = useTranslations("index");
     const locale = useLocale();
     const pathname = usePathname();
     const router = useRouter();
     const [isOpen, setIsOpen] = useState(false);
     const [isPending, startTransition] = useTransition();
     const handleChangeLang = (value: LangCodeType) => {
          setIsOpen(false);
               startTransition(()=>router.replace(
               {pathname},
               {locale: value}
          ))
     }
     return (
          <LangSwitcherSelect open={isOpen} onOpenChange={setIsOpen} disabled={isPending} defaultValue={locale} label={t("langSwitcherLabel")}>
               {languages.map(lang=>(
                    <DropdownMenuItem key={lang.code} onClick={()=>handleChangeLang(lang.code)}>
                         <CircleFlag countryCode={lang.countryCode} className="size-4"/>
                         {lang.label}
                    </DropdownMenuItem>
               ))}
          </LangSwitcherSelect>
     )
}