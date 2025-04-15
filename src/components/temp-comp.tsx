"use client"
import LoadingButton from "./buttons/loading-button";
import { sendTestMessage } from "@/actions/temp-action";
import { useTransition } from "react";
import { toast } from "sonner";
// This Component is Temporary and It'll be removed later
export default function TempComp(){
     const [isPending, startTransition] = useTransition();
     const handleSend = (type: "contact" | "verification" | "new-pass" | "two-factor") => {
          startTransition(() => {
               sendTestMessage(type)
               .then(data=>{
                    if(data?.success){
                         toast.success(data.success)
                    }
                    if(data.error){
                         toast.error(data.error)
                    }
               })
               .catch(()=>toast.error("Что то не так..."))
          })
     }
     return (
          <>
               <LoadingButton loading={isPending} onClick={()=>handleSend("contact")}>Ուղարկել նամակ</LoadingButton>
               <LoadingButton loading={isPending} onClick={()=>handleSend("verification")}>Ուղարկել հաստատման նամակ</LoadingButton>
               <LoadingButton loading={isPending} onClick={()=>handleSend("new-pass")}>Ուղարկել գաղտն․ վերականգման նամակ</LoadingButton>
               <LoadingButton loading={isPending} onClick={()=>handleSend("two-factor")}>Ուղարկել վավերացման նամակ</LoadingButton>
          </>
     )
}