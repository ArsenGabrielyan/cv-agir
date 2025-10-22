import { ExtendedUser } from "@/global";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { UserPlan } from "@db";

interface UserInfoProps{
     user?: Omit<ExtendedUser,"currentPlan">,
     subscription: UserPlan
}
export const UserInfo = ({user,subscription}: UserInfoProps) => {
     return !user ? null : (
          <div className="space-y-3">
               <div className="flex items-center justify-center gap-x-5">
                    <Avatar className="w-16 h-16">
                         <AvatarImage src={user.image || ""}/>
                         <AvatarFallback className="bg-primary">
                              <User className="text-primary-foreground"/>
                         </AvatarFallback>
                    </Avatar>
                    {user.name && (
                         <div className="space-y-2">
                              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">{user.name}</h1>
                              <Button variant="outline" asChild>
                                   <Link href="/settings?tab=account"><Edit/> Խմբագրել պրոֆիլը</Link>
                              </Button>
                         </div>
                    )}
               </div>
               <div className="space-y-4">
                    {user.summary && (
                         <p className="p-3 rounded-xl border shadow">{user.summary}</p>
                    )}
                    {user.email && (
                         <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                              <p className="text-sm font-medium">
                                   Էլ․ Հասցե
                              </p>
                              <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-muted rounded-md">
                                   {user.email}
                              </p>
                         </div>
                    )}
                    {user.jobTitle && (
                         <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                              <p className="text-sm font-medium">
                                   Մասնագիտություն
                              </p>
                              <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-muted rounded-md">
                                   {user.jobTitle}
                              </p>
                         </div>
                    )}
                    {user.phone && (
                         <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                              <p className="text-sm font-medium">
                                   Հեռախոսահամար
                              </p>
                              <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-muted rounded-md">
                                   {user.phone}
                              </p>
                         </div>   
                    )}
                    {user.address && (
                         <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                              <p className="text-sm font-medium">
                                   Բնակության հասցե
                              </p>
                              <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-muted rounded-md">
                                   {user.address}
                              </p>
                         </div>
                    )}
                    {user.hobbies && (
                         <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                              <p className="text-sm font-medium">
                                   Հոբբիներ
                              </p>
                              <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-muted rounded-md">
                                   {user.hobbies}
                              </p>
                         </div>
                    )}
                    <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                         <p className="text-sm font-medium">
                              Երկաստիճան վավերացում
                         </p>
                         <Badge variant={user.isTwoFactorEnabled ? "success" : "destructive"}>
                              {user.isTwoFactorEnabled ? "Միացված է" : "Անջատված է"}
                         </Badge>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-5 rounded-lg border p-3 shadow-sm">
                         <p className="text-sm font-medium">
                              Պրեմիում բաժանորդագրություն
                         </p>
                         <Badge variant={subscription==="premium" ? "success" : "destructive"}>
                              {subscription==="premium" ? "Ակտիվ է" : "Ակտիվ չէ"}
                         </Badge>
                    </div>
               </div>
          </div>
     )
}