import * as React from "react"
import { cn } from "@/lib/utils"
import { PlaceholdersName } from "@/data/types"
import { getRandomPlaceholder } from "@/data/helpers"

type RandomPlaceholderInputProps = React.ComponentProps<"input"> & {
  placeholderKey: PlaceholdersName
}

const RandomPlaceholderInput = React.forwardRef<HTMLInputElement, RandomPlaceholderInputProps>(
  ({ className, type, placeholderKey, ...props }, ref) => {
    const [placeholder, setPlaceholder] = React.useState("");

    React.useEffect(()=>{
      setPlaceholder(getRandomPlaceholder(placeholderKey))
    },[placeholderKey])
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        placeholder={placeholder}
        {...props}
      />
    )
  }
)
RandomPlaceholderInput.displayName = "RandomPlaceholderInput"

export { RandomPlaceholderInput }
