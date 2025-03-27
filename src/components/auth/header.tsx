import Logo from "../layout/logo";
import { useTheme } from "next-themes";

interface HeaderProps{
     label: string
}

export function Header({label}: HeaderProps){
     const {theme} = useTheme()
     return (
          <div className="w-full flex flex-col gap-y-4 items-center justify-center">
               <Logo mode="image" width={240} height={48} theme={theme}/>
               <p className="text-muted-foreground text-sm">{label}</p>
          </div>
     )
}