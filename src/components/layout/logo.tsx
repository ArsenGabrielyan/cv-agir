"use client"
import Link from "next/link";
import LogoImage from "../logo-image";
import { cn } from "@/lib/utils";

interface LogoProps{
     width: number,
     height: number,
     href?: string,
     isAdmin?: boolean,
     isDark?: boolean
}
export default function Logo({href="/",width,height,isAdmin, isDark}: LogoProps){
     return (
          <Link href={href} aria-label="Գլխավոր էջ">
               <LogoImage width={width} height={height} className={cn("hover:stroke-primary hover:fill-primary",!isAdmin ? "fill-foreground stroke-foreground" : isDark ? "fill-white stroke-white" : "fill-black stroke-black")}/>
          </Link>
     )
}