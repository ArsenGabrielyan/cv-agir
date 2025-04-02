"use client"
import { ISettingsPage } from "@/data/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {AccountSettings, Customization, ResumeSettings, SubscriptionSettings} from "./pages"
import { useState } from "react";

const settingsPages: ISettingsPage[] = [
     {id: 1, name: "Հաշիվ", tabName: "account", component: <AccountSettings/>},
     {id: 2, name: "Հավելված", tabName: "customization",component: <Customization/>},
     {id: 3, name: "Ռեզյումեի կարգավորումներ", tabName: "resume", component: <ResumeSettings/>},
     {id: 4, name: "Բաժանորդագրություն", tabName: "subscription", component: <SubscriptionSettings/>}
]

export default function SettingsContent(){
     const [tab, setTab] = useState<string>(localStorage.getItem("curr-settings-page") || "account");
     const handleTabChange = (value: string) => {
          setTab(value);
          localStorage.setItem("curr-settings-page",value)
     }
     return (
          <Tabs defaultValue={tab} onValueChange={handleTabChange}>
               <TabsList className="w-full flex-col md:flex-row h-auto min-h-9 md:h-9">
                    {settingsPages.map(({id,tabName,name})=>(
                         <TabsTrigger className="flex-1 w-full" key={id} value={tabName}>{name}</TabsTrigger>
                    ))}
               </TabsList>
               {settingsPages.map(({id,tabName,component})=>(
                    <TabsContent key={id} value={tabName}>
                         {component}
                    </TabsContent>
               ))}
          </Tabs>
     )
}