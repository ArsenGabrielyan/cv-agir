"use client"
import {
     SidebarGroup,
     SidebarGroupContent,
     SidebarGroupLabel,
     SidebarMenu
} from "@/components/ui/sidebar";
import { SIDEBAR_LINKS } from "@/data/constants/links";
import SidebarItem from "./sidebar-item";

export default function SidebarLinks(){
     return (
          <SidebarGroup>
               <SidebarGroupLabel>Մենյու</SidebarGroupLabel>
               <SidebarGroupContent>
                    <SidebarMenu>
                         {SIDEBAR_LINKS.map((link)=>(
                              <SidebarItem key={link.id} data={link}/>
                         ))}
                    </SidebarMenu>
               </SidebarGroupContent>
          </SidebarGroup>
     )
}