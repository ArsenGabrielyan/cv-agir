"use client"
import { ISidebarLink } from "@/lib/types";
import { Link, usePathname } from "@/i18n/routing";
import {
     SidebarMenuItem,
     SidebarMenuButton,
     SidebarMenuSub,
     SidebarMenuSubItem,
     SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import usePremiumModal from "@/hooks/use-premium-modal";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SidebarItemProps{
     data: ISidebarLink,
     canCreateCoverLetters: boolean
}
export default function SidebarItem({data,canCreateCoverLetters}: SidebarItemProps){
     const {name,href,Icon, dropdown} = data
     const currentRoute = usePathname();
     const premiumModal = usePremiumModal();
     const sidebarLink = useTranslations("dashboard.links");
     const navLink = useTranslations("nav-links")
     return (dropdown && dropdown.length > 0) ? (
          <Collapsible className="group/collapsible">
               <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                         <SidebarMenuButton>
                              <Icon/>
                              {sidebarLink(name)}
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"/>
                         </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                         <SidebarMenuSub>
                              {dropdown.map(({id,name,href,isPremium})=>(
                                   <SidebarMenuSubItem key={id}>
                                        {(isPremium && !canCreateCoverLetters) ? (
                                             <SidebarMenuButton onClick={()=>premiumModal.setOpen(true)}>{navLink(name)}</SidebarMenuButton>
                                        ) : (
                                             <SidebarMenuSubButton asChild>
                                                  <Link href={href}>{navLink(name)}</Link>
                                             </SidebarMenuSubButton>
                                        )}
                                   </SidebarMenuSubItem>
                              ))} 
                         </SidebarMenuSub>
                    </CollapsibleContent>
               </SidebarMenuItem>
          </Collapsible>
     ) : (
          <SidebarMenuItem>
               {href ? (
                    <SidebarMenuButton asChild>
                         <Link href={href} className={cn(currentRoute===href && "text-primary font-semibold")}>
                              <Icon/>
                              {sidebarLink(name)}
                         </Link>
                    </SidebarMenuButton>
               ) : (
                    <SidebarMenuButton>
                         <Icon/>
                         {sidebarLink(name)}
                    </SidebarMenuButton>
               )}
          </SidebarMenuItem>
     )
}