"use client"
import { ISettingsPage } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Settings from "../settings/pages/settings";
import SubscriptionSettings from "../settings/pages/subscription-settings";
import { useSearchParams } from "next/navigation";
import { Subscription } from "@db";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const settingsPages: ISettingsPage[] = [
     { id: 1, tabName: "settings", SettingsContent: Settings},
     { id: 2, tabName: "subscription", SettingsContent: SubscriptionSettings},
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
     const t = useTranslations("settings")
     return (
          <>
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 border-b pb-3">{t("title")}</h1>
               <Tabs defaultValue={tab} onValueChange={handleTabChange}>
                    <TabsList className="w-full flex-col md:flex-row h-auto min-h-9 md:h-9">
                         {settingsPages.map(({id,tabName})=>(
                              <TabsTrigger className="flex-1 w-full" key={id} value={tabName}>{t(`tabs.${tabName}`)}</TabsTrigger>
                         ))}
                    </TabsList>
                    {settingsPages.map(({id,tabName,SettingsContent})=>(
                         <TabsContent key={id} value={tabName}>
                              <SettingsContent {...props}/>
                         </TabsContent>
                    ))}
               </Tabs>
          </>
     )
}