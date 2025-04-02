"use client"
import Link from "next/link";
import Image from "next/image";

interface LogoProps{
     mode: "navbar" | "image",
     width: number,
     height: number,
     href?: string,
     theme?: string
}
export default function Logo({href="/",mode,theme,width,height}: LogoProps){
     return mode==="navbar" ? (
          <Link href={href} className="inline-block bg-[url(/logo.svg)] dark:bg-[url(/logo-white.svg)] hover:bg-[url(/logo-colorful.svg)] bg-no-repeat bg-center bg-contain transition-all" aria-label="Գլխավոր էջ" style={{width: `${width}px`, height: `${height}px`}}>&nbsp;</Link>
     ) : (
          <Link href={href} aria-label="Գլխավոր էջ">
               <Image src={theme && theme==="light" ? "/logo-colorful.svg" : "/logo-white.svg"} alt="logo" width={width} height={height}/>
          </Link>
     )
}