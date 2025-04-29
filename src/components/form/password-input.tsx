import * as React from "react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import zxcvbn from "zxcvbn"
import { Button } from "../ui/button"
import {Eye, EyeOff} from "lucide-react"

export const PasswordInput: React.FC<React.ComponentProps<"input">> = (props) => {
     const [showText, setShowText] = React.useState(false);
     return (
          <div className="flex items-center gap-2">
               <Input {...props} type={showText ? "text" : "password"}/>
               <Button type="button" variant="ghost" size="icon" title={showText ? "Թաքցնել գաղտնաբառը" : "Ցույց տալ գաղտնաբառը"} onClick={()=>setShowText(!showText)}>
                    {showText ? <EyeOff/> : <Eye/>}
               </Button>
          </div>
     )
}

export const PasswordStrengthInput: React.FC<React.ComponentProps<"input">> = ({value,...props})=>{
     const {score} = zxcvbn(value as string)
     const checkPassStrength = (score: zxcvbn.ZXCVBNScore) => {
          const returnData = {
               0: {color: "#a0a0a0", text: 'Շատ թույլ է'},
               1: {color: "#dc3545", text: 'Թույլ է'},
               2: {color: "#ffad00", text: 'Բավարար է'},
               3: {color: "#769246", text: 'Լավ է'},
               4: {color: "#167051", text: 'Վստահելի է'},
          }
          return returnData[score] || {color: '', text: ''}
     }
     const passStrengthData = checkPassStrength(score)
     return (
          <>
               <PasswordInput {...props} value={value}/>
               <Progress value={score*25}/>
               <p className="font-semibold text-right" style={{color: passStrengthData.color}}>{passStrengthData.text}</p>
          </>
     )
}