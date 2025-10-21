"use client"
import { ISidebarLink } from "@/data/types";
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

interface SidebarItemProps{
     data: ISidebarLink,
     canCreateCoverLetters: boolean
}
export default function SidebarItem({data,canCreateCoverLetters}: SidebarItemProps){
     const {name,href,Icon, dropdown} = data
     const currentRoute = usePathname();
     const premiumModal = usePremiumModal();
     return (dropdown && dropdown.length > 0) ? (
          <Collapsible className="group/collapsible">
               <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                         <SidebarMenuButton>
                              <Icon/>
                              <span>{name}</span>
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"/>
                         </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                         <SidebarMenuSub>
                              {dropdown.map(({id,name,href,isPremium})=>(
                                   <SidebarMenuSubItem key={id}>
                                        {(isPremium && !canCreateCoverLetters) ? (
                                             <SidebarMenuButton onClick={()=>premiumModal.setOpen(true)}>{name}</SidebarMenuButton>
                                        ) : (
                                             <SidebarMenuSubButton asChild>
                                                  <Link href={href}>{name}</Link>
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
                              <span>{name}</span>
                         </Link>
                    </SidebarMenuButton>
               ) : (
                    <SidebarMenuButton>
                         <Icon/>
                         <span>{name}</span>
                    </SidebarMenuButton>
               )}
          </SidebarMenuItem>
     )
}