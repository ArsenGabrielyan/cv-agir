"use client"
import { ISettingsPage } from "@/data/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Settings, SubscriptionSettings} from "./pages"
import { useSearchParams } from "next/navigation";
import { Subscription } from "@db";
import { useRouter } from "@/i18n/routing";

const settingsPages: ISettingsPage[] = [
     { id: 1, name: "Հաշիվ և Հավելված", tabName: "settings", SettingsContent: Settings},
     { id: 2, name: "Բաժանորդագրություն", tabName: "subscription", SettingsContent: SubscriptionSettings},
];

export interface SettingsContentProps{
     subscriptions: Subscription[] | null
     isExpired?: boolean
}
export default function SettingsContent(props: SettingsContentProps){
     const searchParams = useSearchParams();
     const tab = searchParams.get("tab") || "settings"
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