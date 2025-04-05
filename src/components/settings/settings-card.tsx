import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SettingsCardProps{
     title: string,
     children: React.ReactNode
}
export default function SettingsCard({title, children}: SettingsCardProps){
     return (
          <Card>
               <CardHeader>
                    <CardTitle>{title}</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                    {children}
               </CardContent>
          </Card>
     )
}