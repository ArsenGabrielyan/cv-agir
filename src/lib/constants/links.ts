import { INavbarLink, ISidebarLink } from "../../lib/types";
import { CircleHelp, LayoutDashboard, LayoutTemplate, Settings, User } from "lucide-react";
import { NavLinks } from "../types/enums";

export const NAVBAR_LINKS: INavbarLink[] = [
     {id: 1, name: NavLinks.Home, href: "/#hero"},
     {id: 2, name: NavLinks.Demo, href: "/#how-it-works"},
     {id: 3, name: NavLinks.Features, href: "/#features"},
     {id: 4, name: NavLinks.Pricing, href: "/#pricing"},
     {id: 5, name: NavLinks.Faq, href: "/#faq"},
]
export const SIDEBAR_LINKS: ISidebarLink[] = [
     {id: 1, name: "Վահանակ", href: "/dashboard", Icon: LayoutDashboard},
     {id: 2, name: "Իմ պրոֆիլը", href: "/profile", Icon: User},
     {id: 3, name: "Շաբլոններ", href: "/templates", Icon: LayoutTemplate},
     {id: 4, name: "Աջակցություն", Icon: CircleHelp, dropdown: [
          { id: 1, name: NavLinks.QNA, href: '/faq',},
          { id: 2, name: NavLinks.Contact, href: "/contact", },
          { id: 3, name: NavLinks.About, href: "/about",},
     ]},
     {id: 5, name: "Կարգավորումներ", href: "/settings", Icon: Settings}
]