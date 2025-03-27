import PageLayout from "@/components/layout/page-layout"
import SettingsContent from "@/components/settings/settings-tabs"
import { Metadata } from "next"

export const metadata: Metadata = {
     title: "Կարգավորումներ"
}

export default function SettingsPage(){
     return (
          <PageLayout sidebarMode>
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 border-b pb-3">Կարգավորումներ</h1>
               <SettingsContent/>
          </PageLayout>
     )
}