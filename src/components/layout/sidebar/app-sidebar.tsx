import { 
     Sidebar,
     SidebarContent,
     SidebarFooter,
     SidebarHeader
} from "@/components/ui/sidebar";
import Logo from "../logo";
import SidebarLinks from "./sidebar-links";
import { currentUser } from "@/lib/auth";
import FreeCounter from "./free-counter";
import { getResumeCountByUserId } from "@/data/db/resumes";
import { getSubscriptionLevel } from "@/actions/subscription-system";

export default async function AppSidebar(){
     const user = await currentUser();
     if(!user || !user.id){
          return null;
     }
     const subscriptionLevel = await getSubscriptionLevel(user.id)
     const resumeCount = await getResumeCountByUserId(user.id)
     return (
          <Sidebar>
               <SidebarHeader className="items-center pt-4">
                    <Logo href="/dashboard" width={200} height={64}/>
               </SidebarHeader>
               <SidebarContent>
                    <SidebarLinks subscriptionLevel={subscriptionLevel}/>
               </SidebarContent>
               {subscriptionLevel==="free" && (
                    <SidebarFooter>
                         <FreeCounter resumeCount={resumeCount}/>
                    </SidebarFooter>
               )}
          </Sidebar>
     )
}