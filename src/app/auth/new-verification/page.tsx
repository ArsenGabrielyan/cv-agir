import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Հաստատեք ձեր էլ․ փոստը | CV-ագիր"
}

export default function NewVerificationPage(){
     return (
          <NewVerificationForm />
     )
}