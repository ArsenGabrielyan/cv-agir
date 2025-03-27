import ResetForm from "@/components/auth/reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Վերականգնել գաղտնաբառը | CV-ագիր"
}

export default function ResetPage(){
     return (
          <ResetForm/>
     )
}