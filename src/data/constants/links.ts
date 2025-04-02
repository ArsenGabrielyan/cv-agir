import { INavbarLink, ISidebarLink } from "../types";
import { CircleHelp, LayoutDashboard, LayoutTemplate, Settings, } from "lucide-react";

export const NAVBAR_LINKS: INavbarLink[] = [
     {id: 1, name: "Գլխավոր էջ", href: "/#hero"},
     {id: 2, name: "Ինչպես է աշխատում", href: "/#how-it-works"},
     {id: 3, name: "Հնարավորություններ", href: "/#features"},
     {id: 4, name: "Առաջարկներ և գներ", href: "/#pricing"},
     {id: 5, name: "Հաճախակի տրվող հարցեր", href: "/#faq"},
]
export const SIDEBAR_LINKS: ISidebarLink[] = [
     {id: 1, name: "Վահանակ", href: "/dashboard", Icon: LayoutDashboard},
     {id: 2, name: "Շաբլոններ", href: "/templates", Icon: LayoutTemplate},
     {id: 3, name: "Աջակցություն", href: "/faq", Icon: CircleHelp, dropdown: [
          { id: 2, name: "Հետադարձ կապ", href: "/contact", },
          { id: 3, name: "Մեր մասին", href: "/about",},
     ]},
     {id: 4, name: "Կարգավորումներ", href: "/settings", Icon: Settings},
]