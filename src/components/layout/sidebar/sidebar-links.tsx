"use client"
import {
     SidebarGroup,
     SidebarGroupContent,
     SidebarGroupLabel,
     SidebarMenu
} from "@/components/ui/sidebar";
import { SIDEBAR_LINKS } from "@/lib/constants/links";
import SidebarItem from "./sidebar-item";
import { UserPlan } from "@db";
import { getAvailableFeatures } from "@/lib/permission";
import { useTranslations } from "next-intl";

interface SidebarLinksProps{
     subscriptionLevel: UserPlan
}
export default function SidebarLinks({subscriptionLevel}: SidebarLinksProps){
     const errMsg = useTranslations("error-messages")
     const {canCreateCoverLetters} = getAvailableFeatures(subscriptionLevel,errMsg)
     const t = useTranslations("dashboard")
     return (
          <SidebarGroup>
               <SidebarGroupLabel>{t("menu")}</SidebarGroupLabel>
               <SidebarGroupContent>
                    <SidebarMenu>
                         {SIDEBAR_LINKS.map((link)=>(
                              <SidebarItem key={link.id} data={link} canCreateCoverLetters={canCreateCoverLetters}/>
                         ))}
                    </SidebarMenu>
               </SidebarGroupContent>
          </SidebarGroup>
     )
}