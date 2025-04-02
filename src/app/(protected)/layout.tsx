import { getSubscriptionLevel } from "@/actions/subscription-system";
import SubscriptionLevelProvider from "@/context/subscription-level-provider";
import { currentUser } from "@/lib/auth";

export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>){
     const user = await currentUser();
     if(!user || !user.id) return null;
     const subLevel = await getSubscriptionLevel(user.id)
     return (
          <SubscriptionLevelProvider subscriptionLevel={subLevel}>
               {children}
          </SubscriptionLevelProvider>
     )
}