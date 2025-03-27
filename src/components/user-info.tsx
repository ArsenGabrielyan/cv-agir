import { ExtendedUser } from "@/next-auth";
import {
     Avatar,
     AvatarImage,
     AvatarFallback
} from "@/components/ui/avatar"
import { Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps{
     user?: ExtendedUser
}
export const UserInfo = ({user}: UserInfoProps) => {
     return (
          <div className="space-y-3">
               <div className="flex items-center justify-center gap-x-5">
                    <Avatar className="w-16 h-16">
                         <AvatarImage src={user?.image || ""}/>
                         <AvatarFallback className="bg-primary">
                              <User className="text-primary-foreground"/>
                         </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                         <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">{user?.name}</h1>
                         <Button variant="outline"><Edit/> Խմբագրել պրոֆիլը</Button>
                    </div>
               </div>
               <div className="space-y-4">
                    <p className="p-3 rounded-xl border shadow">{user?.summary}</p>
                    <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                         <p className="text-sm font-medium">
                              Էլ․ Հասցե
                         </p>
                         <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-muted rounded-md">
                              {user?.email}
                         </p>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                         <p className="text-sm font-medium">
                              Մասնագիտություն
                         </p>
                         <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-muted rounded-md">
                              {user?.jobTitle}
                         </p>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                         <p className="text-sm font-medium">
                              Հեռախոսահամար
                         </p>
                         <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-muted rounded-md">
                              {user?.phone}
                         </p>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                         <p className="text-sm font-medium">
                              Բնակության հասցե
                         </p>
                         <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-muted rounded-md">
                              {user?.address}
                         </p>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                         <p className="text-sm font-medium">
                              Հոբբիներ
                         </p>
                         <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-muted rounded-md">
                              {user?.hobbies}
                         </p>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                         <p className="text-sm font-medium">
                              Երկաստիճան վավերացում
                         </p>
                         <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
                         {user?.isTwoFactorEnabled ? "Միացված է" : "Անջատված է"}
                    </Badge>
                    </div>
               </div>
          </div>
     )
}