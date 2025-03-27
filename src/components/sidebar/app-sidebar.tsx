import { 
     Sidebar,
     SidebarContent,
     SidebarFooter,
     SidebarGroup,
     SidebarGroupContent,
     SidebarGroupLabel,
     SidebarHeader,
     SidebarMenu
} from "../ui/sidebar";
import { SIDEBAR_LINKS } from "@/data/constants/links";
import Logo from "../layout/logo";
import SidebarItem from "./sidebar-item";

export default function AppSidebar(){
     return (
          <Sidebar>
               <SidebarHeader className="items-center pt-4">
                    <Logo href="/dashboard" mode="navbar" width={200} height={40}/>
               </SidebarHeader>
               <SidebarContent>
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
               </SidebarContent>
               <SidebarFooter>
                    TODO: Add an API Limit With Upgrade Button
               </SidebarFooter>
          </Sidebar>
     )
}