"use client"
import ThemeSettings from "@/components/themes/theme-changer";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Logo from "./logo";

interface FooterProps{
     isLandingPage?: boolean,
}
export default function Footer({isLandingPage=false}: FooterProps){
     const year = new Date().getFullYear();
     const {theme} = useTheme()
     const getGridClass = (count: number) => {
          return cn(
               "grid gap-3 w-full min-[400px]:w-auto",
               count >= 1 && "grid-cols-1",
               count >= 2 && "min-[400px]:grid-cols-2",
               count >= 4 && "lg:grid-cols-4",
               "pb-3"
          )
     }
     // TODO: Add a Help Page Soon
     return (
          <footer className={cn("relative bg-background border-primary border-t p-6 z-20", !isLandingPage && "grid gap-3 grid-cols-1 md:grid-cols-2 place-items-center")}>
               {isLandingPage ? (
                    <>
                         <div className="flex justify-between items-start gap-6 flex-col md:flex-row pb-6">
                              <div className="flex flex-col space-y-3 w-full min-[450px]:w-[400px]">
                                   <Logo mode="image" width={200} height={400} theme={theme}/>
                                   <p>CV-ագիր — հայերեն ռեզյումե գեներատոր, որը թույլ է տալիս ստեղծել, խմբագրել և ներբեռնել ռեզյումեներ անվճար։</p>
                              </div>
                              <div className={getGridClass(2)}>
                                   <div className="flex flex-col items-start justify-start w-full">
                                        <h2 className="text-xl font-semibold pb-[5px] mb-2 border-b border-foreground w-full min-[400px]:w-auto">Ռեսուրսներ</h2>
                                        <ul className="w-full">
                                             <li><Link href="/about" className={cn(buttonVariants({variant: "link"}),"px-0")}>Մեր Մասին</Link></li>
                                             <li><Link href="/pricing" className={cn(buttonVariants({variant: "link"}),"px-0")}>Առաջարկներ և գներ</Link></li>
                                             <li><Link href="/templates" className={cn(buttonVariants({variant: "link"}),"px-0")}>Շաբլոններ</Link></li>
                                        </ul>
                                   </div>
                                   <div className="flex flex-col items-start justify-start">
                                        <h2 className="text-xl font-semibold pb-[5px] mb-2 border-b border-foreground w-full min-[400px]:w-auto">Աջակցություն</h2>
                                        <ul className="w-full">
                                             <li><Link href="/contact" className={cn(buttonVariants({variant: "link"}),"px-0")}>Հետադարձ կապ</Link></li>
                                             <li><Link href="/faq" className={cn(buttonVariants({variant: "link"}),"px-0")}>Հարցեր և պատասխաններ</Link></li>
                                        </ul>
                                   </div>
                              </div>
                         </div>
                         <div className="grid gap-3 grid-cols-1 md:grid-cols-2 place-items-center border-t pt-3 text-center md:text-left">
                              <p>&copy; {year} Արսեն Գաբրիելյան։ Բոլոր իրավունքները պաշտպանված են։</p>
                              <ThemeSettings/>
                         </div>
                    </>
               ) : (
                    <>
                         <Logo mode="image" width={200} height={400} theme={theme}/>
                         <p>&copy; {year} Արսեն Գաբրիելյան։ Բոլոր իրավունքները պաշտպանված են։</p>
                    </>
               )}
          </footer>
     )
}