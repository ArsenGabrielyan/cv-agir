import { getSubscriptionLevel } from "@/actions/subscription-system";
import PageLayout from "@/components/layout/page-layout";
import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth"
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
     title: "Ձեր պրոֆիլը"
}

export default async function ProfilePage(){
     const user = await currentUser();
     if(!user || !user.id){
          redirect("/auth/login")
     }
     const subscriptionLevel = await getSubscriptionLevel(user.id)
     return (
          <PageLayout sidebarMode>
               <UserInfo user={user} subscription={subscriptionLevel}/>
          </PageLayout>
     )
}