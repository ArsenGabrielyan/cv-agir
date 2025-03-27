import { ErrorCard } from "@/components/auth/error-card";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Վայ, մի բան սխալ տեղի ունեցավ | CV-ագիր"
}

export default function AuthErrorPage(){
     return (
          <ErrorCard />
     )
}