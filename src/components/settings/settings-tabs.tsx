"use client"
import { ISettingsPage } from "@/data/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {AccountSettings, Customization, SubscriptionSettings} from "./pages"
import { useSearchParams, useRouter } from "next/navigation";
import { Subscription } from "@db/";

const settingsPages: ISettingsPage[] = [
     { id: 1, name: "Հաշիվ", tabName: "account", SettingsContent: AccountSettings},
     { id: 2, name: "Հավելված", tabName: "customization", SettingsContent: Customization},
     { id: 3, name: "Բաժանորդագրություն", tabName: "subscription", SettingsContent: SubscriptionSettings},
];

export interface SettingsContentProps{
     subscriptions: Subscription[] | null
     isExpired?: boolean
}
export default function SettingsContent(props: SettingsContentProps){
     const searchParams = useSearchParams();
     const tab = searchParams.get("tab") || "account"
     const router = useRouter()
     const handleTabChange = (value: string) => {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("tab",value)
          router.push(`?${newSearchParams.toString()}`)
     }
     return (
          <Tabs defaultValue={tab} onValueChange={handleTabChange}>
               <TabsList className="w-full flex-col md:flex-row h-auto min-h-9 md:h-9">
                    {settingsPages.map(({id,tabName,name})=>(
                         <TabsTrigger className="flex-1 w-full" key={id} value={tabName}>{name}</TabsTrigger>
                    ))}
               </TabsList>
               {settingsPages.map(({id,tabName,SettingsContent})=>(
                    <TabsContent key={id} value={tabName}>
                         <SettingsContent {...props}/>
                    </TabsContent>
               ))}
          </Tabs>
     )
}