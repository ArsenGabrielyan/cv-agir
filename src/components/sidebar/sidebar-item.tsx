"use client"
import { ISidebarLink } from "../../data/types";
import Link from "next/link";
import {
     SidebarMenuItem,
     SidebarMenuButton,
     SidebarMenuAction
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface SidebarItemProps{
     data: ISidebarLink,
}
export default function SidebarItem({data}: SidebarItemProps){
     const {name,href,Icon, dropdown} = data
     const currentRoute = usePathname()
     return (
          <SidebarMenuItem>
               <SidebarMenuButton asChild>
                    <Link href={href} className={(currentRoute===href && "text-primary font-semibold") as string}>
                         <Icon/>
                         <span>{name}</span>
                    </Link>
               </SidebarMenuButton>
               {dropdown && (
                    <DropdownMenu modal={false}>
                         <DropdownMenuTrigger asChild>
                              <SidebarMenuAction>
                                   <MoreHorizontal/>
                              </SidebarMenuAction>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent side="right" align="start">
                              {dropdown.map(({id,name,href})=>(
                                   <DropdownMenuItem key={id}>
                                        <Link href={href}>{name}</Link>
                                   </DropdownMenuItem>
                              ))}     
                         </DropdownMenuContent>
                    </DropdownMenu>
               )}
          </SidebarMenuItem>
     )
}