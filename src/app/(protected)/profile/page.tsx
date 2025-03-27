import PageLayout from "@/components/layout/page-layout";
import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth"
import { ExtendedUser } from "@/next-auth";

export default async function ProfilePage(){
     const user = await currentUser();
     return (
          <PageLayout sidebarMode>
               <UserInfo user={user as ExtendedUser}/>
          </PageLayout>
     )
}