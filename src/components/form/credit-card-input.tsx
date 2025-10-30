import CreditCardIcon from "../settings/premium/cc-components/credit-card-icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export default function CreditCardInput({value, ...props}: React.ComponentProps<"input">){
     return (
          <InputGroup>
               <InputGroupInput
                    {...props}
                    value={value}
                    placeholder="1234567890123456"
                    maxLength={16}
               />
               <InputGroupAddon>
                    <CreditCardIcon value={typeof value==="string" ? value : ""}/>
               </InputGroupAddon>
          </InputGroup>
     )
}