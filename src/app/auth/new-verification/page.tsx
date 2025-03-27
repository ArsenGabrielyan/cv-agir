import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Հաստատեք Ձեր էլ․ փոստը"
}

export default function NewVerificationPage(){
     return (
          <NewVerificationForm />
     )
}