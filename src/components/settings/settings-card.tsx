import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SettingsCardProps{
     title: string,
     children: React.ReactNode,
     className?: string
}
export default function SettingsCard({title, children, className}: SettingsCardProps){
     return (
          <Card>
               <CardHeader>
                    <CardTitle>{title}</CardTitle>
               </CardHeader>
               <CardContent className={cn("space-y-4",className)}>
                    {children}
               </CardContent>
          </Card>
     )
}