import CreditCardIcon from "../cc-components/credit-card-icon";
import { Input } from "../ui/input";

// TODO: Add a Bank Provider to credit card input

export default function CreditCardInput({value, ...props}: React.ComponentProps<"input">){
     return (
          <div className="flex items-center gap-2">
               <CreditCardIcon value={typeof value==="string" ? value : ""}/>
               <Input
                    {...props}
                    value={value}
                    placeholder="1234567890123456"
                    maxLength={16}
               />
          </div>
     )
}