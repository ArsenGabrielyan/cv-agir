import Navbar from "./navbar";
import Footer from "./footer";
import AppSidebar from "./sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "../auth/user-button";
import PremiumModal from "../settings/premium/premium-modal";

interface PageLayoutProps{
     children: React.ReactNode,
     isLandingPage?: boolean,
     sidebarMode?: boolean,
     landingFooter?: boolean,
     editorPage?: boolean
}
export default function PageLayout({children,isLandingPage=false,sidebarMode=false,landingFooter=false,editorPage=false}: PageLayoutProps){
     return sidebarMode ? (
          <SidebarProvider>
               <AppSidebar/>
               <main className="px-4 py-2 w-full h-full">
                    <div className="flex justify-between items-center w-full">
                         <SidebarTrigger/>
                         <UserButton/>
                    </div>
                    {children}
               </main>
               <PremiumModal/>
          </SidebarProvider>
     ) : (
          <div className="flex min-h-screen flex-col">
               <Navbar isLandingPage={isLandingPage}/>
               {editorPage ? children : (
                    <main className="w-full h-full">
                         {children}
                    </main>
               )}
               {!editorPage && (
                    <Footer isLandingPage={isLandingPage || landingFooter}/>
               )}
               <PremiumModal/>
          </div>
     )
}