"use client"
import Navbar from "./navbar";
import Footer from "./footer";
import AppSidebar from "../sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "../auth/user-button";

interface PageLayoutProps{
     children: React.ReactNode,
     isLandingPage?: boolean,
     sidebarMode?: boolean,
     landingFooter?: boolean,
     resumeEditor?: boolean
}
export default function PageLayout({children,isLandingPage=false,sidebarMode=false,landingFooter=false,resumeEditor=false}: PageLayoutProps){
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
          </SidebarProvider>
     ) : (
          <div className="flex min-h-screen flex-col">
               <Navbar isLandingPage={isLandingPage}/>
               {resumeEditor ? children : (
                    <main className="w-full h-full">
                         {children}
                    </main>
               )}
               {!resumeEditor && (
                    <Footer isLandingPage={isLandingPage || landingFooter}/>
               )}
          </div>
     )
}