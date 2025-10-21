"use client"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
     DropdownMenuLabel,
     DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
     Avatar,
     AvatarImage,
     AvatarFallback
} from "@/components/ui/avatar"
import { useCurrentSubscriptionLevel, useCurrentUser } from "@/hooks/use-current-user"
import { LogoutButton } from "./logout-button"
import { User, LogOut, Settings, FileUser, FileText, LayoutDashboard, } from "lucide-react"
import { Link } from "@/i18n/routing"

export const UserButton = () => {
     const user = useCurrentUser();
     const subscriptionLevel = useCurrentSubscriptionLevel(user && user?.subscriptionEndDate ? new Date(user?.subscriptionEndDate) < new Date() : true);
     return (
          <DropdownMenu modal={false}>
               <DropdownMenuTrigger>
                    <Avatar>
                         <AvatarImage src={user?.image || ""}/>
                         <AvatarFallback className="bg-primary">
                              <User className="text-primary-foreground"/>
                         </AvatarFallback>
                    </Avatar>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="pb-0">{user?.name}</DropdownMenuLabel>
                    <p className="font-normal px-2 text-sm pb-1.5">{user?.email}</p>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild className="cursor-pointer">
                         <Link href="/profile">
                              <User/> Իմ պրոֆիլը
                         </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                         <Link href="/dashboard">
                              <LayoutDashboard/> Վահանակ
                         </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                         <Link href="/dashboard?show=resume">
                              <FileUser/> Ռեզյումեներ
                         </Link>
                    </DropdownMenuItem>
                    {subscriptionLevel==="premium" && (
                         <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href="/dashboard?show=cover-letter">
                                   <FileText/> Ուղեկցող նամակներ
                              </Link>
                         </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className="cursor-pointer">
                         <Link href="/settings">
                              <Settings/> Կարգավորումներ
                         </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <LogoutButton>
                         <DropdownMenuItem className="cursor-pointer text-destructive">
                              <LogOut className="h-4 w-4 mr-2 text-destructive"/>
                              Դուրս գալ
                         </DropdownMenuItem>
                    </LogoutButton>
               </DropdownMenuContent>
          </DropdownMenu>
     )
}