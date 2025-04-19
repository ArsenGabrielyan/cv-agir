"use client"
import {
     SidebarGroup,
     SidebarGroupContent,
     SidebarGroupLabel,
     SidebarMenu
} from "@/components/ui/sidebar";
import { SIDEBAR_LINKS } from "@/data/constants/links";
import SidebarItem from "./sidebar-item";
import { UserPlan } from "@db";
import { getAvailableFeatures } from "@/lib/permission";

interface SidebarLinksProps{
     subscriptionLevel: UserPlan
}
export default function SidebarLinks({subscriptionLevel}: SidebarLinksProps){
     const {canCreateCoverLetters} = getAvailableFeatures(subscriptionLevel)
     return (
          <SidebarGroup>
               <SidebarGroupLabel>Մենյու</SidebarGroupLabel>
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