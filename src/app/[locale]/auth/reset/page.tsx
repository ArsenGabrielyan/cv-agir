import ResetForm from "@/components/auth/reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Վերականգնել գաղտնաբառը"
}

export default function ResetPage(){
     return (
          <ResetForm/>
     )
}