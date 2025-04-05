"use client"
import { Label } from "@/components/ui/label";
import ThemeSettings from "@/components/themes/theme-changer";
import SettingsCard from "../settings-card";

export default function Customization(){
     return (
          <SettingsCard title="Դիզայն">
               <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                         <Label>Հավելվածի տեսքը</Label>
                         <p className="text-[0.8rem] text-muted-foreground">Հավելվածի գույնը և ռեժիմը</p>
                    </div>
                    <ThemeSettings/>
               </div>
          </SettingsCard>
     )
}