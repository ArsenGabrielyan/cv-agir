import PageLayout from "@/components/layout/page-layout"
import SettingsContent from "@/components/settings/settings-tabs"
import { getSubscriptionsByUserId, getIsSubscriptionExpired } from "@/data/db/subscription"
import { currentUser } from "@/lib/auth"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
     title: "Կարգավորումներ"
}

export default async function SettingsPage(){
     const user = await currentUser();
     if(!user || !user.id){
          redirect("/auth/login")
     }
     const [subscriptions, isExpired] = await Promise.all([
          getSubscriptionsByUserId(user.id),
          getIsSubscriptionExpired(user.id)
     ])
     return (
          <PageLayout sidebarMode>
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 border-b pb-3">Կարգավորումներ</h1>
               <SettingsContent subscriptions={subscriptions} isExpired={isExpired}/>
          </PageLayout>
     )
}