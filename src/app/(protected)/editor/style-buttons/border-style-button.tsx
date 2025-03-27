import { Button } from "@/components/ui/button"
import { Circle, Square, Squircle } from "lucide-react"

export enum BorderStyles {
     Square = "square",
     Circle = "circle",
     Squircle = "squircle"
}
const borderStyles = Object.values(BorderStyles);

interface BorderStyleButtonProps{
     borderStyle: BorderStyles | undefined
     onChange: (borderStyle: BorderStyles) => void
}
export default function BorderStyleButton({borderStyle, onChange}: BorderStyleButtonProps){
     const handleClick = () => {
          const currStyle = borderStyle ?? borderStyles[0]
          const currIndex = borderStyles.indexOf(currStyle);
          const nextIndex = (currIndex+1) % borderStyles.length;
          onChange(borderStyles[nextIndex])
     }
     const Icon = borderStyle === "square" ? Square : borderStyle === "circle" ? Circle : Squircle
     return (
          <Button
               variant="outline"
               size="icon"
               title="Փոխել եզրագծի ձևը"
               onClick={handleClick}
          >
               <Icon className="size-5"/>
          </Button>
     )
}